import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Smile,
  Heart,
  ThumbsUp,
  Coffee,
  Briefcase,
  Zap,
  Clock,
  Plus,
  X,
  Keyboard,
  Camera,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { StickerData } from "@/types/sticker";

interface MobileStickerBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStickerSelect: (sticker: StickerData) => void;
  onCreateSticker?: () => void;
  trigger?: React.ReactNode;
}

// Mobile-optimized sticker tabs
const MOBILE_TABS = [
  { id: "recent", icon: <Clock className="w-4 h-4" />, label: "Recent" },
  { id: "emotions", icon: <Smile className="w-4 h-4" />, label: "Emotions" },
  { id: "gestures", icon: <ThumbsUp className="w-4 h-4" />, label: "Gestures" },
  { id: "memes", icon: <Zap className="w-4 h-4" />, label: "Memes" },
  { id: "business", icon: <Briefcase className="w-4 h-4" />, label: "Business" },
  { id: "food", icon: <Coffee className="w-4 h-4" />, label: "Food" },
  { id: "hearts", icon: <Heart className="w-4 h-4" />, label: "Hearts" },
];

// Mock sticker data for demonstration
const mockStickers: Record<string, StickerData[]> = {
  recent: [
    { id: "r1", emoji: "😂", name: "Laughing", type: "emoji", tags: [], usageCount: 10 },
    { id: "r2", emoji: "❤️", name: "Red Heart", type: "emoji", tags: [], usageCount: 8 },
    { id: "r3", emoji: "👍", name: "Thumbs Up", type: "emoji", tags: [], usageCount: 5 },
  ],
  emotions: [
    { id: "e1", emoji: "😀", name: "Happy", type: "emoji", tags: [] },
    { id: "e2", emoji: "😂", name: "Laughing", type: "emoji", tags: [] },
    { id: "e3", emoji: "😍", name: "Love Eyes", type: "emoji", tags: [] },
    { id: "e4", emoji: "😢", name: "Crying", type: "emoji", tags: [] },
    { id: "e5", emoji: "😮", name: "Surprised", type: "emoji", tags: [] },
    { id: "e6", emoji: "😴", name: "Sleeping", type: "emoji", tags: [] },
    { id: "e7", emoji: "🤔", name: "Thinking", type: "emoji", tags: [] },
    { id: "e8", emoji: "😎", name: "Cool", type: "emoji", tags: [] },
    { id: "e9", emoji: "😇", name: "Angel", type: "emoji", tags: [] },
    { id: "e10", emoji: "🤗", name: "Hugging", type: "emoji", tags: [] },
    { id: "e11", emoji: "🥳", name: "Party", type: "emoji", tags: [] },
    { id: "e12", emoji: "😅", name: "Nervous", type: "emoji", tags: [] },
    { id: "e13", emoji: "😉", name: "Winking", type: "emoji", tags: [] },
    { id: "e14", emoji: "😘", name: "Kissing", type: "emoji", tags: [] },
    { id: "e15", emoji: "😱", name: "Shocked", type: "emoji", tags: [] },
    { id: "e16", emoji: "🤢", name: "Sick", type: "emoji", tags: [] },
    { id: "e17", emoji: "😵", name: "Dizzy", type: "emoji", tags: [] },
    { id: "e18", emoji: "🤪", name: "Crazy", type: "emoji", tags: [] },
  ],
  gestures: [
    { id: "g1", emoji: "👍", name: "Thumbs Up", type: "emoji", tags: [] },
    { id: "g2", emoji: "👎", name: "Thumbs Down", type: "emoji", tags: [] },
    { id: "g3", emoji: "👌", name: "OK Hand", type: "emoji", tags: [] },
    { id: "g4", emoji: "✌️", name: "Peace", type: "emoji", tags: [] },
    { id: "g5", emoji: "🤝", name: "Handshake", type: "emoji", tags: [] },
    { id: "g6", emoji: "👏", name: "Clapping", type: "emoji", tags: [] },
    { id: "g7", emoji: "🙏", name: "Prayer", type: "emoji", tags: [] },
    { id: "g8", emoji: "💪", name: "Strong", type: "emoji", tags: [] },
    { id: "g9", emoji: "👋", name: "Wave", type: "emoji", tags: [] },
    { id: "g10", emoji: "🤘", name: "Rock On", type: "emoji", tags: [] },
    { id: "g11", emoji: "🤙", name: "Call Me", type: "emoji", tags: [] },
    { id: "g12", emoji: "👊", name: "Fist Bump", type: "emoji", tags: [] },
  ],
  hearts: [
    { id: "h1", emoji: "❤️", name: "Red Heart", type: "emoji", tags: [] },
    { id: "h2", emoji: "🧡", name: "Orange Heart", type: "emoji", tags: [] },
    { id: "h3", emoji: "💛", name: "Yellow Heart", type: "emoji", tags: [] },
    { id: "h4", emoji: "💚", name: "Green Heart", type: "emoji", tags: [] },
    { id: "h5", emoji: "💙", name: "Blue Heart", type: "emoji", tags: [] },
    { id: "h6", emoji: "💜", name: "Purple Heart", type: "emoji", tags: [] },
    { id: "h7", emoji: "🖤", name: "Black Heart", type: "emoji", tags: [] },
    { id: "h8", emoji: "🤍", name: "White Heart", type: "emoji", tags: [] },
    { id: "h9", emoji: "💔", name: "Broken Heart", type: "emoji", tags: [] },
    { id: "h10", emoji: "💕", name: "Two Hearts", type: "emoji", tags: [] },
    { id: "h11", emoji: "💖", name: "Sparkling Heart", type: "emoji", tags: [] },
    { id: "h12", emoji: "💗", name: "Growing Heart", type: "emoji", tags: [] },
  ],
  memes: [
    { id: "m1", emoji: "🔥", name: "Fire", type: "emoji", tags: [] },
    { id: "m2", emoji: "💯", name: "100", type: "emoji", tags: [] },
    { id: "m3", emoji: "⚡", name: "Lightning", type: "emoji", tags: [] },
    { id: "m4", emoji: "🚀", name: "Rocket", type: "emoji", tags: [] },
    { id: "m5", emoji: "💎", name: "Diamond", type: "emoji", tags: [] },
    { id: "m6", emoji: "👑", name: "Crown", type: "emoji", tags: [] },
    { id: "m7", emoji: "✨", name: "Sparkles", type: "emoji", tags: [] },
    { id: "m8", emoji: "🌟", name: "Star", type: "emoji", tags: [] },
  ],
  business: [
    { id: "b1", emoji: "💼", name: "Briefcase", type: "emoji", tags: [] },
    { id: "b2", emoji: "💰", name: "Money", type: "emoji", tags: [] },
    { id: "b3", emoji: "📈", name: "Chart Up", type: "emoji", tags: [] },
    { id: "b4", emoji: "📊", name: "Bar Chart", type: "emoji", tags: [] },
    { id: "b5", emoji: "💡", name: "Idea", type: "emoji", tags: [] },
    { id: "b6", emoji: "🎯", name: "Target", type: "emoji", tags: [] },
    { id: "b7", emoji: "🏆", name: "Trophy", type: "emoji", tags: [] },
    { id: "b8", emoji: "💻", name: "Laptop", type: "emoji", tags: [] },
  ],
  food: [
    { id: "f1", emoji: "☕", name: "Coffee", type: "emoji", tags: [] },
    { id: "f2", emoji: "🍵", name: "Tea", type: "emoji", tags: [] },
    { id: "f3", emoji: "🍺", name: "Beer", type: "emoji", tags: [] },
    { id: "f4", emoji: "🍷", name: "Wine", type: "emoji", tags: [] },
    { id: "f5", emoji: "🍕", name: "Pizza", type: "emoji", tags: [] },
    { id: "f6", emoji: "🍔", name: "Burger", type: "emoji", tags: [] },
    { id: "f7", emoji: "🍟", name: "Fries", type: "emoji", tags: [] },
    { id: "f8", emoji: "🌮", name: "Taco", type: "emoji", tags: [] },
  ],
};

export const MobileStickerBottomSheet: React.FC<MobileStickerBottomSheetProps> = ({
  isOpen,
  onOpenChange,
  onStickerSelect,
  onCreateSticker,
  trigger,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const filteredStickers = React.useMemo(() => {
    const stickers = mockStickers[activeTab] || [];
    if (!searchQuery) return stickers;
    
    return stickers.filter(sticker => 
      sticker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sticker.emoji.includes(searchQuery)
    );
  }, [activeTab, searchQuery]);

  const handleStickerClick = (sticker: StickerData) => {
    onStickerSelect(sticker);
    onOpenChange(false);
    toast({
      title: "Sticker sent!",
      description: `Sent ${sticker.name} sticker`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent 
        side="bottom" 
        className="h-[75vh] max-h-[500px] p-0 border-t-2 border-gray-200 dark:border-gray-700 rounded-t-xl"
      >
        <div className="flex flex-col h-full">
          {/* Header with handle and actions */}
          <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Drag handle */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
            
            {/* Title and action buttons */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Stickers</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="h-9 w-9"
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    toast({
                      title: "Camera",
                      description: "Camera sticker creation coming soon!",
                    });
                  }}
                  className="h-9 w-9"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onCreateSticker?.();
                    toast({
                      title: "Create",
                      description: "Custom sticker creation coming soon!",
                    });
                  }}
                  className="h-9 w-9"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-9 w-9"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Tabs and Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <ScrollArea orientation="horizontal" className="w-full">
                <TabsList className="inline-flex h-12 w-full bg-transparent p-0 justify-start">
                  {MOBILE_TABS.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "flex flex-col items-center gap-1 px-4 py-2 text-xs rounded-none border-b-2 transition-all",
                        "data-[state=active]:border-blue-500 data-[state=active]:text-blue-600",
                        "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
                      )}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span className="text-[10px] leading-none">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {MOBILE_TABS.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                      {filteredStickers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            {tab.icon}
                          </div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {searchQuery ? "No stickers found" : "No stickers yet"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {searchQuery ? "Try a different search" : "Add some stickers to get started"}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-6 gap-3">
                          {filteredStickers.map((sticker) => (
                            <Button
                              key={sticker.id}
                              variant="ghost"
                              className="h-12 w-12 p-0 text-2xl hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-95 touch-manipulation"
                              onClick={() => handleStickerClick(sticker)}
                            >
                              <span className="text-xl">{sticker.emoji}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Tabs>

          {/* Bottom actions bar */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {filteredStickers.length} stickers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "GIF",
                    description: "GIF stickers coming soon!",
                  });
                }}
                className="h-8 px-3 text-xs"
              >
                GIF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Create",
                    description: "Custom sticker packs coming soon!",
                  });
                }}
                className="h-8 px-3 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileStickerBottomSheet;
