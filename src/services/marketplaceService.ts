import {
  Product,
  SellerProfile,
  Review,
  Order,
  OrderItem,
  CartItem,
  Address,
  PaymentMethod,
  Category,
  BoostOption,
  Promotion,
  MarketplaceStats,
  SellerStats,
  SearchResult,
  ProductFilter,
} from "@/types/marketplace";

// Production categories - will be fetched from database
export const defaultCategories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    image: "/placeholder-category.png",
    productCount: 0,
    featured: true,
    subcategories: [
      {
        id: "smartphones",
        name: "Smartphones",
        slug: "smartphones",
        productCount: 0,
        featured: false,
      },
      {
        id: "laptops",
        name: "Laptops",
        slug: "laptops",
        productCount: 0,
        featured: false,
      },
      {
        id: "headphones",
        name: "Headphones",
        slug: "headphones",
        productCount: 0,
        featured: false,
      },
      {
        id: "cameras",
        name: "Cameras",
        slug: "cameras",
        productCount: 0,
        featured: false,
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    image: "/placeholder-category.png",
    productCount: 0,
    featured: true,
    subcategories: [
      {
        id: "mens-clothing",
        name: "Men's Clothing",
        slug: "mens-clothing",
        productCount: 0,
        featured: false,
      },
      {
        id: "womens-clothing",
        name: "Women's Clothing",
        slug: "womens-clothing",
        productCount: 0,
        featured: false,
      },
      {
        id: "shoes",
        name: "Shoes",
        slug: "shoes",
        productCount: 0,
        featured: false,
      },
      {
        id: "accessories",
        name: "Accessories",
        slug: "accessories",
        productCount: 0,
        featured: false,
      },
    ],
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    slug: "home-garden",
    image: "/placeholder-category.png",
    productCount: 0,
    featured: true,
    subcategories: [
      {
        id: "furniture",
        name: "Furniture",
        slug: "furniture",
        productCount: 0,
        featured: false,
      },
      {
        id: "decor",
        name: "Home Decor",
        slug: "decor",
        productCount: 0,
        featured: false,
      },
      {
        id: "kitchen",
        name: "Kitchen",
        slug: "kitchen",
        productCount: 0,
        featured: false,
      },
      {
        id: "garden",
        name: "Garden",
        slug: "garden",
        productCount: 0,
        featured: false,
      },
    ],
  },
  {
    id: "digital",
    name: "Digital Products",
    slug: "digital",
    image: "/placeholder-category.png",
    productCount: 0,
    featured: true,
    subcategories: [
      {
        id: "software",
        name: "Software",
        slug: "software",
        productCount: 0,
        featured: false,
      },
      {
        id: "ebooks",
        name: "E-books",
        slug: "ebooks",
        productCount: 0,
        featured: false,
      },
      {
        id: "courses",
        name: "Online Courses",
        slug: "courses",
        productCount: 0,
        featured: false,
      },
    ],
  },
];

// Empty arrays for production - will be populated from database/API
export const emptyProducts: Product[] = [];
export const emptySellers: SellerProfile[] = [];
export const emptyReviews: Review[] = [];
export const emptyOrders: Order[] = [];
export const emptyAddresses: Address[] = [];
export const emptyPaymentMethods: PaymentMethod[] = [];
export const emptyPromotions: Promotion[] = [];

// Production boost options (these can remain as business configuration)
export const productionBoostOptions: BoostOption[] = [
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

// Service functions for production marketplace
export const marketplaceService = {
  // Product operations
  async searchProducts(
    query: string,
    filters: ProductFilter = {},
  ): Promise<SearchResult> {
    try {
      // In production, this would make an API call to your backend
      const response = await fetch(`/api/marketplace/search?q=${encodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      // Return empty result for production
      return {
        products: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
        filters: {
          categories: [],
          brands: [],
          priceRanges: [],
          ratings: [],
        },
        suggestions: [],
      };
    }
  },

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const response = await fetch(`/api/marketplace/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Get product error:', error);
      return null;
    }
  },

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    try {
      const response = await fetch('/api/marketplace/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  async updateProduct(
    productId: string,
    updates: Partial<Product>,
  ): Promise<Product> {
    try {
      const response = await fetch(`/api/marketplace/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      return await response.json();
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/marketplace/products/${productId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Delete product error:', error);
      return false;
    }
  },

  // Order operations
  async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ): Promise<Order> {
    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  async getOrders(customerId: string): Promise<Order[]> {
    try {
      const response = await fetch(`/api/marketplace/orders?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
  ): Promise<Order> {
    try {
      const response = await fetch(`/api/marketplace/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Review operations
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const response = await fetch(`/api/marketplace/products/${productId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return await response.json();
    } catch (error) {
      console.error('Get reviews error:', error);
      return [];
    }
  },

  async addReview(
    reviewData: Omit<Review, "id" | "createdAt">,
  ): Promise<Review> {
    try {
      const response = await fetch('/api/marketplace/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      return await response.json();
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  },

  // Utility functions
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch('/api/marketplace/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      // Return default categories as fallback
      return defaultCategories;
    }
  },

  async getSellers(): Promise<SellerProfile[]> {
    try {
      const response = await fetch('/api/marketplace/sellers');
      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }
      return await response.json();
    } catch (error) {
      console.error('Get sellers error:', error);
      return [];
    }
  },

  async getBoostOptions(): Promise<BoostOption[]> {
    // Return production boost options (these are configuration, not dynamic data)
    return productionBoostOptions;
  },

  async calculateShipping(
    addressId: string,
    items: CartItem[],
  ): Promise<number> {
    try {
      const response = await fetch('/api/marketplace/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId, items }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping');
      }

      const data = await response.json();
      return data.cost;
    } catch (error) {
      console.error('Calculate shipping error:', error);
      return 0;
    }
  },

  async getRecommendedProducts(productId?: string): Promise<Product[]> {
    try {
      const url = productId 
        ? `/api/marketplace/recommendations?productId=${productId}`
        : '/api/marketplace/recommendations';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return await response.json();
    } catch (error) {
      console.error('Get recommendations error:', error);
      return [];
    }
  },

  // Featured and trending products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/marketplace/products/featured');
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return await response.json();
    } catch (error) {
      console.error('Get featured products error:', error);
      return [];
    }
  },

  async getTrendingProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/marketplace/products/trending');
      if (!response.ok) {
        throw new Error('Failed to fetch trending products');
      }
      return await response.json();
    } catch (error) {
      console.error('Get trending products error:', error);
      return [];
    }
  },

  // Analytics
  async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      const response = await fetch('/api/marketplace/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Get marketplace stats error:', error);
      return {
        totalProducts: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        conversionRate: 0,
      };
    }
  },
};

export default marketplaceService;
