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

// Define types for our context
type MarketplaceContextType = {
  products: Product[];
  sponsoredProducts: Product[];
  featuredProducts: Product[];
  sellers: SellerProfile[];
  reviews: Record<string, Review[]>;
  boostOptions: BoostOption[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  myListings: Product[];
  filter: ProductFilter;
  activeProduct: Product | null;
  activeSeller: SellerProfile | null;
  isLoading: boolean;  // Add isLoading property
  setFilter: (filter: ProductFilter) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  getSeller: (sellerId: string) => SellerProfile | undefined;
  getProductReviews: (productId: string) => Review[];
  setActiveProduct: (product: Product | null) => void;
  setActiveSeller: (seller: SellerProfile | null) => void;
  createProduct: (product: Omit<Product, "id" | "sellerId" | "sellerName" | "sellerAvatar" | "createdAt" | "updatedAt">) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<boolean>;
  boostProduct: (productId: string, boostOptionId: string) => Promise<Product>;
  addReview: (productId: string, rating: number, content: string) => Promise<Review>;
  getSellerProducts: (sellerId: string) => Product[];
  getCartTotal: () => number;
  checkout: () => Promise<boolean>;
  messageUser: (userId: string, message: string, productId?: string) => Promise<boolean>;
};
