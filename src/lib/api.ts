// API client for server communication
const BASE_URL = "/api";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async signUp(email: string, password: string, name: string) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signIn(email: string, password: string) {
    return this.request("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Profile methods
  async getProfile(userId: string) {
    return this.request(`/profiles/${userId}`);
  }

  async getProfileByUsername(username: string) {
    return this.request(`/profiles/username/${username}`);
  }

  async updateProfile(userId: string, updates: any) {
    return this.request(`/profiles/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Posts methods
  async getPosts(limit = 50, offset = 0) {
    return this.request(`/posts?limit=${limit}&offset=${offset}`);
  }

  async getPost(id: string) {
    return this.request(`/posts/${id}`);
  }

  async getUserPosts(userId: string) {
    return this.request(`/posts/user/${userId}`);
  }

  async createPost(post: any) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  async updatePost(id: string, updates: any) {
    return this.request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  // Products methods
  async getProducts(limit = 50, offset = 0) {
    return this.request(`/products?limit=${limit}&offset=${offset}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async getSellerProducts(sellerId: string) {
    return this.request(`/products/seller/${sellerId}`);
  }

  async createProduct(product: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Follow methods
  async followUser(followerId: string, followingId: string) {
    return this.request("/follow", {
      method: "POST",
      body: JSON.stringify({ followerId, followingId }),
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.request("/follow", {
      method: "DELETE",
      body: JSON.stringify({ followerId, followingId }),
    });
  }

  async getFollowers(userId: string) {
    return this.request(`/follow/followers/${userId}`);
  }

  async getFollowing(userId: string) {
    return this.request(`/follow/following/${userId}`);
  }

  async checkFollowStatus(followerId: string, followingId: string) {
    return this.request(`/follow/check/${followerId}/${followingId}`);
  }
}

export const apiClient = new ApiClient();

// Helper function for simple API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("/") ? `/api${endpoint}` : `/api/${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
