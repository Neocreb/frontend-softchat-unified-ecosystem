export interface SyncProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  // Page context
  pageId: string;
  pageName: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  // Product metadata
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  sales: number;
  featured: boolean;
  discountPercentage?: number;
  originalPrice?: number;
  shippingInfo: {
    freeShipping: boolean;
    estimatedDays: number;
    cost?: number;
  };
  specifications?: { [key: string]: string };
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    inStock: boolean;
    attributes: { [key: string]: string };
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class MarketplaceSyncService {
  private products: SyncProduct[] = [];

  // Mock data for demonstration
  private getMockProducts(): SyncProduct[] {
    return [
      {
        id: "product-1",
        name: "AI Analytics Pro",
        price: 299,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300",
        description: "Advanced AI-powered analytics platform for enterprise businesses. Get real-time insights and predictive analytics.",
        inStock: true,
        pageId: "page-1",
        pageName: "TechCorp Solutions",
        seller: {
          id: "seller-1",
          name: "TechCorp Solutions",
          avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
          verified: true
        },
        category: "Software",
        subcategory: "Analytics",
        tags: ["ai", "analytics", "enterprise", "saas"],
        rating: 4.8,
        reviewCount: 124,
        sales: 2450,
        featured: true,
        shippingInfo: {
          freeShipping: true,
          estimatedDays: 0,
          cost: 0
        },
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
        ],
        specifications: {
          "License Type": "Enterprise",
          "Users": "Unlimited",
          "Support": "24/7 Premium",
          "Integration": "API Available"
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z"
      },
      {
        id: "product-2",
        name: "Premium Coffee Beans",
        price: 24.99,
        originalPrice: 34.99,
        discountPercentage: 29,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
        description: "Ethically sourced premium coffee beans from the highlands of Colombia. Rich, smooth taste with notes of chocolate and caramel.",
        inStock: true,
        pageId: "page-2",
        pageName: "Mountain Coffee Co.",
        seller: {
          id: "seller-2",
          name: "Mountain Coffee Co.",
          avatar: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=100",
          verified: true
        },
        category: "Food & Beverage",
        subcategory: "Coffee",
        tags: ["coffee", "premium", "organic", "colombian"],
        rating: 4.9,
        reviewCount: 89,
        sales: 1250,
        featured: false,
        shippingInfo: {
          freeShipping: false,
          estimatedDays: 3,
          cost: 5.99
        },
        images: [
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600",
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600"
        ],
        variants: [
          {
            id: "variant-1",
            name: "1lb Bag",
            price: 24.99,
            inStock: true,
            attributes: { weight: "1lb", grind: "Whole Bean" }
          },
          {
            id: "variant-2", 
            name: "2lb Bag",
            price: 44.99,
            inStock: true,
            attributes: { weight: "2lb", grind: "Whole Bean" }
          }
        ],
        specifications: {
          "Origin": "Colombia",
          "Roast Level": "Medium",
          "Certification": "Organic, Fair Trade",
          "Flavor Notes": "Chocolate, Caramel"
        },
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-18T12:00:00Z"
      },
      {
        id: "product-3",
        name: "Fitness Tracker Pro",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Perfect for athletes and fitness enthusiasts.",
        inStock: true,
        pageId: "page-3",
        pageName: "FitTech Wearables",
        seller: {
          id: "seller-3",
          name: "FitTech Wearables",
          avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100",
          verified: false
        },
        category: "Electronics",
        subcategory: "Wearables",
        tags: ["fitness", "tracker", "gps", "health"],
        rating: 4.6,
        reviewCount: 234,
        sales: 890,
        featured: true,
        shippingInfo: {
          freeShipping: true,
          estimatedDays: 2,
          cost: 0
        },
        images: [
          "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600",
          "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600"
        ],
        variants: [
          {
            id: "variant-3",
            name: "Black",
            price: 199.99,
            inStock: true,
            attributes: { color: "Black", size: "Medium" }
          },
          {
            id: "variant-4",
            name: "Blue",
            price: 199.99,
            inStock: false,
            attributes: { color: "Blue", size: "Medium" }
          }
        ],
        specifications: {
          "Battery Life": "7 Days",
          "Water Resistance": "50m",
          "Display": "AMOLED",
          "Connectivity": "Bluetooth 5.0"
        },
        createdAt: "2024-01-12T14:00:00Z",
        updatedAt: "2024-01-19T10:30:00Z"
      }
    ];
  }

  // Get all products
  async getAllProducts(): Promise<SyncProduct[]> {
    return this.getMockProducts();
  }

  // Get products from a specific page
  async getPageProducts(pageId: string): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.pageId === pageId);
  }

  // Add product from page to main marketplace
  async syncPageProduct(pageId: string, pageName: string, productData: Partial<SyncProduct>): Promise<SyncProduct> {
    const newProduct: SyncProduct = {
      id: `product-${Date.now()}`,
      name: productData.name || '',
      price: productData.price || 0,
      image: productData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      description: productData.description || '',
      inStock: productData.inStock ?? true,
      pageId,
      pageName,
      seller: productData.seller || {
        id: 'current-user',
        name: pageName,
        avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
        verified: false
      },
      category: productData.category || 'Other',
      subcategory: productData.subcategory,
      tags: productData.tags || [],
      rating: 0,
      reviewCount: 0,
      sales: 0,
      featured: false,
      shippingInfo: productData.shippingInfo || {
        freeShipping: false,
        estimatedDays: 5,
        cost: 9.99
      },
      images: productData.images || [productData.image || ''],
      specifications: productData.specifications || {},
      variants: productData.variants || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search products
  async searchProducts(query: string): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Get featured products
  async getFeaturedProducts(limit?: number): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    const featured = allProducts.filter(product => product.featured);
    
    return limit ? featured.slice(0, limit) : featured;
  }

  // Get products by seller/page
  async getSellerProducts(sellerId: string): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.seller.id === sellerId);
  }

  // Update product stock
  async updateProductStock(productId: string, inStock: boolean, variantId?: string): Promise<SyncProduct | null> {
    const allProducts = await this.getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
      if (variantId && product.variants) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
          variant.inStock = inStock;
        }
      } else {
        product.inStock = inStock;
      }
      return product;
    }
    
    return null;
  }

  // Get bestselling products
  async getBestsellingProducts(limit?: number): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    const sorted = allProducts.sort((a, b) => b.sales - a.sales);
    
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Get new arrivals
  async getNewArrivals(limit?: number): Promise<SyncProduct[]> {
    const allProducts = await this.getAllProducts();
    const sorted = allProducts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return limit ? sorted.slice(0, limit) : sorted;
  }
}

export const marketplaceSyncService = new MarketplaceSyncService();
export default marketplaceSyncService;
