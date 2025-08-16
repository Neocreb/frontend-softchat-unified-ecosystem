import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Product, 
  SellerProfile, 
  Review, 
  CartItem, 
  WishlistItem, 
  ProductFilter,
  BoostOption
} from "@/types/marketplace";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Production boost options (configuration data)
const productionBoostOptions: BoostOption[] = [
  {
    id: "boost1",
    name: "24-Hour Boost",
    duration: 1,
    price: 5.99,
    description: "Boost your product visibility for 24 hours",
    features: [
      "Featured in sponsored section",
      "Higher search ranking",
      "Mobile app promotion",
    ],
  },
  {
    id: "boost2",
    name: "3-Day Boost",
    duration: 3,
    price: 14.99,
    description: "Boost your product visibility for 3 days",
    features: [
      "Featured in sponsored section",
      "Higher search ranking",
      "Mobile app promotion",
      "Email newsletter inclusion",
    ],
    popular: true,
  },
  {
    id: "boost3",
    name: "Weekly Boost",
    duration: 7,
    price: 29.99,
    description: "Boost your product visibility for a full week",
    features: [
      "Featured in sponsored section",
      "Higher search ranking",
      "Mobile app promotion",
      "Email newsletter inclusion",
      "Social media promotion",
    ],
  },
  {
    id: "boost4",
    name: "Premium Boost",
    duration: 14,
    price: 49.99,
    description: "Maximum visibility for 2 weeks",
    features: [
      "Featured in sponsored section",
      "Higher search ranking",
      "Mobile app promotion",
      "Email newsletter inclusion",
      "Social media promotion",
      "Homepage banner",
    ],
  },
];

interface MarketplaceContextType {
  products: Product[];
  sellers: SellerProfile[];
  reviews: Review[];
  boostOptions: BoostOption[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  filter: ProductFilter;
  isLoading: boolean;
  
  // Product functions
  getProducts: () => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product | null>;
  searchProducts: (query: string, filter?: ProductFilter) => Promise<Product[]>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Cart functions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Wishlist functions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Filter functions
  setFilter: (filter: ProductFilter) => void;
  clearFilter: () => void;
  
  // Boost functions
  boostProduct: (productId: string, boostOptionId: string) => Promise<boolean>;
  getBoostOptions: () => BoostOption[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [filter, setFilterState] = useState<ProductFilter>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('marketplace_cart');
    const savedWishlist = localStorage.getItem('marketplace_wishlist');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('marketplace_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Product functions
  const getProducts = async (): Promise<Product[]> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/marketplace/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/marketplace/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const searchProducts = async (query: string, searchFilter?: ProductFilter): Promise<Product[]> => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (searchFilter?.category) params.append('category', searchFilter.category);
      if (searchFilter?.minPrice) params.append('minPrice', searchFilter.minPrice.toString());
      if (searchFilter?.maxPrice) params.append('maxPrice', searchFilter.maxPrice.toString());
      
      const response = await fetch(`/api/marketplace/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: "Search Error",
        description: "Failed to search products",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await fetch('/api/marketplace/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`/api/marketplace/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/marketplace/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return false;
    }
  };

  // Cart functions
  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        productId,
        productName: product.name,
        productImage: product.image,
        price: product.discountPrice || product.price,
        quantity,
        addedAt: new Date().toISOString(),
      };
      setCart(prev => [...prev, newItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart",
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Wishlist functions
  const addToWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    if (wishlist.some(item => item.productId === productId)) {
      toast({
        title: "Already in Wishlist",
        description: "This item is already in your wishlist",
      });
      return;
    }

    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      productId,
      productName: product.name,
      productImage: product.image,
      price: product.discountPrice || product.price,
      addedAt: new Date().toISOString(),
    };
    
    setWishlist(prev => [...prev, newItem]);
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist`,
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.productId !== productId));
    toast({
      title: "Removed from Wishlist",
      description: "Item removed from your wishlist",
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  // Filter functions
  const setFilter = (newFilter: ProductFilter) => {
    setFilterState(newFilter);
  };

  const clearFilter = () => {
    setFilterState({});
  };

  // Boost functions
  const boostProduct = async (productId: string, boostOptionId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/marketplace/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, boostOptionId }),
      });
      
      if (!response.ok) throw new Error('Failed to boost product');
      
      toast({
        title: "Product Boosted",
        description: "Your product visibility has been increased",
      });
      
      return true;
    } catch (error) {
      console.error('Error boosting product:', error);
      toast({
        title: "Boost Failed",
        description: "Failed to boost product",
        variant: "destructive",
      });
      return false;
    }
  };

  const getBoostOptions = () => productionBoostOptions;

  const value: MarketplaceContextType = {
    // State
    products,
    sellers,
    reviews,
    boostOptions: productionBoostOptions,
    cart,
    wishlist,
    filter,
    isLoading,
    
    // Product functions
    getProducts,
    getProduct,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    
    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    
    // Filter functions
    setFilter,
    clearFilter,
    
    // Boost functions
    boostProduct,
    getBoostOptions,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export default MarketplaceContext;
