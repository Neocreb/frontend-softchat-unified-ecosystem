import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Smile,
  Heart,
  ThumbsUp,
  Coffee,
  Briefcase,
  Gamepad2,
  Sparkles,
  Star,
  Download,
  Plus,
  Search,
  Clock,
  MoreVertical,
  Trash2,
  Flag,
  Share,
  Bookmark,
  BookmarkCheck,
  Upload,
  Grid3X3,
  List,
  Filter,
  TrendingUp,
  Crown,
  Users,
  Zap,
  Camera,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { 
  StickerData, 
  StickerPackData, 
  StickerCategory, 
  StickerPickerTab,
  UserStickerLibrary,
  EMOJI_STICKER_PACKS 
} from "@/types/sticker";

interface MemeStickerPickerProps {
  onStickerSelect: (sticker: StickerData) => void;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
}

// Sticker picker tabs configuration
const STICKER_TABS: StickerPickerTab[] = [
  { id: "recent", name: "Recent", icon: <Clock className="w-4 h-4" /> },
  { id: "favorites", name: "Favorites", icon: <Heart className="w-4 h-4" /> },
  { id: "emotions", name: "Emotions", icon: <Smile className="w-4 h-4" /> },
  { id: "gestures", name: "Gestures", icon: <ThumbsUp className="w-4 h-4" /> },
  { id: "memes", name: "Memes", icon: <Zap className="w-4 h-4" /> },
  { id: "business", name: "Business", icon: <Briefcase className="w-4 h-4" /> },
  { id: "food", name: "Food", icon: <Coffee className="w-4 h-4" /> },
  { id: "my_packs", name: "My Packs", icon: <Users className="w-4 h-4" /> },
  { id: "add_new", name: "Create", icon: <Plus className="w-4 h-4" /> },
];

export const MemeStickerPicker: React.FC<MemeStickerPickerProps> = ({
  onStickerSelect,
  onClose,
  className,
  isMobile = false,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPack, setSelectedPack] = useState<StickerPackData | null>(null);
  
  // Mock data - would be fetched from API
  const [userLibrary, setUserLibrary] = useState<UserStickerLibrary>({
    recentStickers: [],
    favoriteStickers: [],
    downloadedPacks: EMOJI_STICKER_PACKS,
    customPacks: [],
  });
  
  const [availablePacks, setAvailablePacks] = useState<StickerPackData[]>(EMOJI_STICKER_PACKS);
  const [trendingPacks, setTrendingPacks] = useState<StickerPackData[]>([]);

  // Filter stickers based on search query
  const filteredStickers = useMemo(() => {
    if (activeTab === "recent") return userLibrary.recentStickers;
    if (activeTab === "favorites") return userLibrary.favoriteStickers;
    if (activeTab === "my_packs") return userLibrary.customPacks.flatMap(pack => pack.stickers);
    
    const pack = availablePacks.find(p => p.id === activeTab);
    if (!pack) return [];
    
    return pack.stickers.filter(sticker => 
      searchQuery === "" || 
      sticker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sticker.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, searchQuery, userLibrary, availablePacks]);

  const handleStickerClick = (sticker: StickerData) => {
    onStickerSelect(sticker);
    
    // Add to recent stickers
    setUserLibrary(prev => ({
      ...prev,
      recentStickers: [
        sticker,
        ...prev.recentStickers.filter(s => s.id !== sticker.id).slice(0, 19)
      ]
    }));
    
    toast({
      title: "Sticker sent!",
      description: `Sent ${sticker.name} sticker`,
    });
  };

  const handleToggleFavorite = (sticker: StickerData, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setUserLibrary(prev => {
      const isFavorite = prev.favoriteStickers.some(s => s.id === sticker.id);
      
      return {
        ...prev,
        favoriteStickers: isFavorite
          ? prev.favoriteStickers.filter(s => s.id !== sticker.id)
          : [...prev.favoriteStickers, sticker]
      };
    });
    
    toast({
      title: userLibrary.favoriteStickers.some(s => s.id === sticker.id) 
        ? "Removed from favorites" 
        : "Added to favorites",
      description: sticker.name,
    });
  };

  const handleDownloadPack = (pack: StickerPackData) => {
    setUserLibrary(prev => ({
      ...prev,
      downloadedPacks: [...prev.downloadedPacks, pack]
    }));
    
    toast({
      title: "Pack downloaded!",
      description: `${pack.name} pack is now available in your library`,
    });
  };

  const handleReportSticker = (sticker: StickerData) => {
    toast({
      title: "Sticker reported",
      description: "Thank you for helping keep our community safe",
    });
  };

  const handleShareSticker = (sticker: StickerData) => {
    toast({
      title: "Share feature",
      description: "Sticker sharing coming soon!",
    });
  };

  const renderStickerGrid = (stickers: StickerData[]) => {
    if (stickers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Sparkles className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No stickers found</p>
          <p className="text-sm">Try searching for something else</p>
        </div>
      );
    }

    return (
      <div className={cn(
        "grid gap-2",
        viewMode === "grid"
          ? (isMobile ? "grid-cols-5 gap-3" : "grid-cols-6 gap-2")
          : "grid-cols-1"
      )}>
        {stickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            viewMode={viewMode}
            isMobile={isMobile}
            isFavorite={userLibrary.favoriteStickers.some(s => s.id === sticker.id)}
            onClick={() => handleStickerClick(sticker)}
            onToggleFavorite={(e) => handleToggleFavorite(sticker, e)}
            onReport={() => handleReportSticker(sticker)}
            onShare={() => handleShareSticker(sticker)}
          />
        ))}
      </div>
    );
  };

  const renderPackGrid = (packs: StickerPackData[]) => {
    return (
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        {packs.map((pack) => (
          <StickerPackCard
            key={pack.id}
            pack={pack}
            isMobile={isMobile}
            isDownloaded={userLibrary.downloadedPacks.some(p => p.id === pack.id)}
            onDownload={() => handleDownloadPack(pack)}
            onView={() => setSelectedPack(pack)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg",
      isMobile
        ? "w-full max-w-full h-[70vh] max-h-[500px] flex flex-col"
        : "w-96 h-[500px] flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("font-semibold", isMobile ? "text-base" : "text-lg")}>Stickers</h3>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="h-8 w-8"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={cn(isMobile ? "h-9 w-9" : "h-8 w-8")}
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isMobile ? "Search..." : "Search stickers..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("pl-10", isMobile ? "h-10" : "h-9")}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
        <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <ScrollArea orientation="horizontal" className="w-full">
            <TabsList className={cn(
              "inline-flex h-auto p-1 bg-transparent w-full",
              isMobile ? "justify-start" : "justify-start"
            )}>
              {STICKER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "flex items-center gap-1 px-2 py-2 text-xs rounded-lg transition-all whitespace-nowrap",
                    "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900",
                    "data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300",
                    isMobile ? "min-w-[44px] flex-col gap-0.5" : "flex-row gap-2"
                  )}
                >
                  <span className={isMobile ? "text-sm" : ""}>{tab.icon}</span>
                  <span className={cn(
                    isMobile ? "text-[10px] leading-tight" : "text-xs",
                    isMobile && tab.name.length > 6 ? "hidden" : ""
                  )}>
                    {isMobile ? tab.name.slice(0, 4) : tab.name}
                  </span>
                  {tab.count && tab.count > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-3 min-w-[12px]">
                      {tab.count > 9 ? "9+" : tab.count}
                    </Badge>
                  )}
                  {tab.premium && (
                    <Crown className="w-2.5 h-2.5 text-yellow-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            <div className={cn("p-3 md:p-4", isMobile && "pb-6")}>
              {/* Recent Stickers */}
              <TabsContent value="recent" className="mt-0">
                {renderStickerGrid(filteredStickers)}
              </TabsContent>

              {/* Favorite Stickers */}
              <TabsContent value="favorites" className="mt-0">
                {renderStickerGrid(filteredStickers)}
              </TabsContent>

              {/* Category Stickers */}
              {["emotions", "gestures", "memes", "business", "food"].map(category => (
                <TabsContent key={category} value={category} className="mt-0">
                  {renderStickerGrid(filteredStickers)}
                </TabsContent>
              ))}

              {/* My Packs */}
              <TabsContent value="my_packs" className="mt-0">
                {userLibrary.customPacks.length > 0 ? (
                  renderPackGrid(userLibrary.customPacks)
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg font-medium mb-2">No custom packs yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your own sticker packs to express yourself
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Pack
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Create New */}
              <TabsContent value="add_new" className="mt-0">
                <StickerCreationPanel
                  isMobile={isMobile}
                  onCreatePack={() => setShowCreateDialog(true)}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>

      {/* Pack Detail Dialog */}
      {selectedPack && (
        <Dialog open={!!selectedPack} onOpenChange={() => setSelectedPack(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedPack.name}</DialogTitle>
              <DialogDescription>{selectedPack.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {selectedPack.stickers.map((sticker) => (
                <Button
                  key={sticker.id}
                  variant="ghost"
                  className="h-12 w-12 p-0 text-2xl"
                  onClick={() => {
                    handleStickerClick(sticker);
                    setSelectedPack(null);
                  }}
                >
                  {sticker.emoji}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Individual sticker card component
interface StickerCardProps {
  sticker: StickerData;
  viewMode: "grid" | "list";
  isMobile: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onReport: () => void;
  onShare: () => void;
}

const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  viewMode,
  isMobile,
  isFavorite,
  onClick,
  onToggleFavorite,
  onReport,
  onShare,
}) => {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
        <div className="text-2xl" onClick={onClick}>
          {sticker.emoji}
        </div>
        <div className="flex-1 min-w-0" onClick={onClick}>
          <p className="font-medium truncate">{sticker.name}</p>
          <p className="text-xs text-muted-foreground">
            Used {sticker.usageCount} times
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleFavorite}
          >
            {isFavorite ? 
              <BookmarkCheck className="w-4 h-4 text-red-500" /> : 
              <Bookmark className="w-4 h-4" />
            }
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onReport} className="text-destructive">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        className={cn(
          "h-14 w-14 p-0 text-2xl hover:bg-muted/70 rounded-lg transition-all duration-200 relative",
          "hover:scale-110 active:scale-95"
        )}
        onClick={onClick}
      >
        {sticker.emoji}
        
        {/* Animated indicator */}
        {sticker.type === "animated" && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </Button>
      
      {/* Hover actions */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md"
          onClick={onToggleFavorite}
        >
          {isFavorite ? 
            <Heart className="w-3 h-3 text-red-500 fill-current" /> : 
            <Heart className="w-3 h-3" />
          }
        </Button>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {sticker.name}
      </div>
    </div>
  );
};

// Sticker pack card component
interface StickerPackCardProps {
  pack: StickerPackData;
  isMobile: boolean;
  isDownloaded: boolean;
  onDownload: () => void;
  onView: () => void;
}

const StickerPackCard: React.FC<StickerPackCardProps> = ({
  pack,
  isMobile,
  isDownloaded,
  onDownload,
  onView,
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm flex items-center gap-2">
              {pack.name}
              {pack.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
              {pack.isOfficial && <Badge variant="secondary" className="text-xs">Official</Badge>}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {pack.stickers.length} stickers
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs">{pack.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 gap-1 mb-3">
          {pack.stickers.slice(0, 4).map((sticker) => (
            <div key={sticker.id} className="text-lg text-center">
              {sticker.emoji}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onView} className="flex-1">
            View
          </Button>
          {!isDownloaded && (
            <Button size="sm" onClick={onDownload} className="flex-1">
              <Download className="w-3 h-3 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Sticker creation panel component
interface StickerCreationPanelProps {
  isMobile: boolean;
  onCreatePack: () => void;
}

const StickerCreationPanel: React.FC<StickerCreationPanelProps> = ({
  isMobile,
  onCreatePack,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">Create Your Own Stickers</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Turn your images into stickers and share them with the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Button onClick={onCreatePack} className="justify-start h-auto p-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">Upload Images</p>
              <p className="text-xs text-muted-foreground">
                Create a pack from your photos
              </p>
            </div>
          </div>
        </Button>
        
        <Button variant="outline" className="justify-start h-auto p-4">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">Take Photos</p>
              <p className="text-xs text-muted-foreground">
                Use camera to create stickers
              </p>
            </div>
          </div>
        </Button>
        
        <Button variant="outline" className="justify-start h-auto p-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">AI Generator</p>
              <p className="text-xs text-muted-foreground">
                Generate with AI (Coming Soon)
              </p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default MemeStickerPicker;
