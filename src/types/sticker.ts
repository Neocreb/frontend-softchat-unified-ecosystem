// Sticker types for the frontend
export interface StickerData {
  id: string;
  name: string;
  emoji?: string; // For emoji-based stickers
  fileUrl: string;
  thumbnailUrl?: string;
  packId: string;
  packName: string;
  type: "static" | "animated" | "gif" | "emoji";
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  usageCount: number;
  tags: string[];
  isOriginal: boolean;
  animated?: boolean; // For backward compatibility
}

export interface StickerPackData {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  creatorId: string;
  creatorName?: string;
  isPublic: boolean;
  isPremium: boolean;
  isOfficial: boolean;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  category: StickerCategory;
  stickers: StickerData[];
  isDownloaded?: boolean; // For user library
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StickerCategory = 
  | "emotions"
  | "gestures" 
  | "memes"
  | "business"
  | "food"
  | "animals"
  | "sports"
  | "travel"
  | "custom"
  | "trending"
  | "recent"
  | "favorites";

export interface UserStickerLibrary {
  recentStickers: StickerData[];
  favoriteStickers: StickerData[];
  downloadedPacks: StickerPackData[];
  customPacks: StickerPackData[];
}

export interface StickerPickerTab {
  id: StickerCategory | "recent" | "favorites" | "my_packs" | "add_new";
  name: string;
  icon: React.ReactNode;
  count?: number;
  premium?: boolean;
}

export interface StickerUsageData {
  stickerId: string;
  packId: string;
  usedAt: string;
  conversationId?: string;
}

export interface StickerReport {
  id: string;
  stickerId?: string;
  packId?: string;
  reportedBy: string;
  reason: "inappropriate" | "spam" | "copyright" | "other";
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
}

export interface StickerCreationRequest {
  id: string;
  userId: string;
  packName: string;
  description?: string;
  category: StickerCategory;
  isPublic: boolean;
  files: StickerCreationFile[];
  status: "pending" | "processing" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

export interface StickerCreationFile {
  id: string;
  originalName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  type: string;
  size: number;
  width: number;
  height: number;
  processedUrl?: string; // After optimization
}

export interface StickerSearchFilters {
  category?: StickerCategory;
  isPremium?: boolean;
  isAnimated?: boolean;
  tags?: string[];
  sortBy?: "popularity" | "recent" | "rating" | "name";
}

export interface StickerInteraction {
  action: "send" | "add_to_favorites" | "remove_from_favorites" | "download_pack" | "report" | "forward";
  stickerId?: string;
  packId?: string;
  conversationId?: string;
  timestamp: string;
}

// Predefined emoji sticker packs for backward compatibility
export const EMOJI_STICKER_PACKS: StickerPackData[] = [
  {
    id: "emotions",
    name: "Emotions",
    description: "Express your feelings with these emotion stickers",
    creatorId: "system",
    creatorName: "Softchat",
    isPublic: true,
    isPremium: false,
    isOfficial: true,
    downloadCount: 0,
    rating: 5.0,
    ratingCount: 1000,
    tags: ["emotions", "feelings", "mood"],
    category: "emotions",
    stickers: [
      { id: "happy", name: "Happy", emoji: "😀", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["happy", "joy"], isOriginal: false },
      { id: "laughing", name: "Laughing", emoji: "😂", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["laugh", "funny"], isOriginal: false },
      { id: "love", name: "Love Eyes", emoji: "😍", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["love", "heart"], isOriginal: false },
      { id: "crying", name: "Crying", emoji: "😢", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["sad", "cry"], isOriginal: false },
      { id: "surprised", name: "Surprised", emoji: "😮", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["wow", "surprised"], isOriginal: false },
      { id: "sleeping", name: "Sleeping", emoji: "😴", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["sleep", "tired"], isOriginal: false },
      { id: "thinking", name: "Thinking", emoji: "🤔", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["think", "hmm"], isOriginal: false },
      { id: "cool", name: "Cool", emoji: "😎", fileUrl: "", packId: "emotions", packName: "Emotions", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["cool", "sunglasses"], isOriginal: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gestures",
    name: "Gestures",
    description: "Hand gestures and body language stickers",
    creatorId: "system",
    creatorName: "Softchat",
    isPublic: true,
    isPremium: false,
    isOfficial: true,
    downloadCount: 0,
    rating: 4.8,
    ratingCount: 750,
    tags: ["gestures", "hands", "body"],
    category: "gestures",
    stickers: [
      { id: "thumbs_up", name: "Thumbs Up", emoji: "👍", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["good", "like"], isOriginal: false },
      { id: "thumbs_down", name: "Thumbs Down", emoji: "👎", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["bad", "dislike"], isOriginal: false },
      { id: "ok_hand", name: "OK Hand", emoji: "👌", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["ok", "good"], isOriginal: false },
      { id: "peace", name: "Peace", emoji: "✌️", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["peace", "victory"], isOriginal: false },
      { id: "clapping", name: "Clapping", emoji: "👏", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["clap", "applause"], isOriginal: false },
      { id: "prayer", name: "Prayer", emoji: "🙏", fileUrl: "", packId: "gestures", packName: "Gestures", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["pray", "thanks"], isOriginal: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "memes",
    name: "Memes",
    description: "Popular meme stickers for viral conversations",
    creatorId: "system",
    creatorName: "Softchat",
    isPublic: true,
    isPremium: false,
    isOfficial: true,
    downloadCount: 0,
    rating: 4.9,
    ratingCount: 1250,
    tags: ["memes", "funny", "viral"],
    category: "memes",
    stickers: [
      { id: "rofl", name: "ROFL", emoji: "🤣", fileUrl: "", packId: "memes", packName: "Memes", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["rofl", "lol"], isOriginal: false },
      { id: "mind_blown", name: "Mind Blown", emoji: "🤯", fileUrl: "", packId: "memes", packName: "Memes", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["mind", "blown"], isOriginal: false },
      { id: "upside_down", name: "Upside Down", emoji: "🙃", fileUrl: "", packId: "memes", packName: "Memes", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["upside", "down"], isOriginal: false },
      { id: "zany", name: "Zany", emoji: "🤪", fileUrl: "", packId: "memes", packName: "Memes", type: "emoji", width: 128, height: 128, fileSize: 0, mimeType: "text/emoji", usageCount: 0, tags: ["crazy", "zany"], isOriginal: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
