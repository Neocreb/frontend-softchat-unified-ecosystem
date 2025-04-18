
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount?: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isSponsored?: boolean;
  boostedUntil?: string;
  tags?: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating?: number;
  sellerVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  salesCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  searchQuery?: string;
  sortBy?: "recent" | "price-low" | "price-high" | "popular";
}

export interface BoostOption {
  id: string;
  name: string;
  duration: number; // in days
  price: number;
  description: string;
}
