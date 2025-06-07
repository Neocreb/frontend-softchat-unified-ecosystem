import { 
  users, 
  profiles, 
  posts, 
  postLikes, 
  postComments, 
  products, 
  followers, 
  chatConversations, 
  chatMessages, 
  notifications,
  type User, 
  type Profile,
  type Post,
  type Product,
  type InsertUser, 
  type InsertProfile,
  type InsertPost,
  type InsertProduct
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Profile operations
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined>;

  // Post operations
  getPosts(limit?: number, offset?: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  getPostsByUserId(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsBySellerId(sellerId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Follow operations
  followUser(followerId: string, followingId: string): Promise<boolean>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<string[]>;
  getFollowing(userId: string): Promise<string[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private posts: Map<string, Post>;
  private products: Map<string, Product>;
  private follows: Map<string, Set<string>>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.posts = new Map();
    this.products = new Map();
    this.follows = new Map();
    this.currentId = 1;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = { 
      ...insertUser, 
      id,
      emailConfirmed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Profile operations
  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.username === username);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.generateId();
    const profile: Profile = {
      ...insertProfile,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const profile = Array.from(this.profiles.values()).find(p => p.userId === userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.profiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Post operations
  async getPosts(limit = 50, offset = 0): Promise<Post[]> {
    const allPosts = Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return allPosts.slice(offset, offset + limit);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.generateId();
    const post: Post = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Product operations
  async getProducts(limit = 50, offset = 0): Promise<Product[]> {
    const allProducts = Array.from(this.products.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return allProducts.slice(offset, offset + limit);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsBySellerId(sellerId: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.generateId();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (!this.follows.has(followerId)) {
      this.follows.set(followerId, new Set());
    }
    this.follows.get(followerId)!.add(followingId);
    return true;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const following = this.follows.get(followerId);
    if (following) {
      return following.delete(followingId);
    }
    return false;
  }

  async getFollowers(userId: string): Promise<string[]> {
    const followers: string[] = [];
    for (const [followerId, following] of this.follows.entries()) {
      if (following.has(userId)) {
        followers.push(followerId);
      }
    }
    return followers;
  }

  async getFollowing(userId: string): Promise<string[]> {
    const following = this.follows.get(userId);
    return following ? Array.from(following) : [];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const following = this.follows.get(followerId);
    return following ? following.has(followingId) : false;
  }
}

export const storage = new MemStorage();
