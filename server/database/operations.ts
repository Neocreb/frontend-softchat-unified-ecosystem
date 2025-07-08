import {
  eq,
  and,
  or,
  desc,
  asc,
  count,
  sql,
  like,
  gte,
  lte,
  inArray,
} from "drizzle-orm";
import { db } from "../db";
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
  p2pOffers,
  trades,
  freelanceJobs,
  freelanceProposals,
  freelanceProjects,
  projectMilestones,
  freelanceEscrow,
  freelanceDisputes,
  freelanceMessages,
  type User,
  type Profile,
  type Post,
  type Product,
  type InsertUser,
  type InsertProfile,
  type InsertPost,
  type InsertProduct,
  type FreelanceJob,
  type InsertFreelanceJob,
} from "@shared/schema";
import { hashPassword } from "../config/security";

// User operations
export const userOperations = {
  async create(userData: Omit<InsertUser, "id">): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();
    return user;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async update(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  },

  async verifyEmail(id: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ emailConfirmed: true, updatedAt: new Date() })
      .where(eq(users.id, id));
    return result.rowCount > 0;
  },
};

// Profile operations
export const profileOperations = {
  async create(profileData: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(profileData).returning();
    return profile;
  },

  async findByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  },

  async findByUsername(username: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username));
    return profile;
  },

  async update(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  },

  async updatePoints(userId: string, points: number): Promise<void> {
    await db
      .update(profiles)
      .set({
        points: sql`${profiles.points} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId));
  },

  async getLeaderboard(limit: number = 50): Promise<Profile[]> {
    return db
      .select()
      .from(profiles)
      .orderBy(desc(profiles.points))
      .limit(limit);
  },
};

// Post operations
export const postOperations = {
  async create(postData: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  },

  async findById(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  },

  async getFeed(
    userId?: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Post[]> {
    if (userId) {
      // Get posts from followed users
      const followedUsers = db
        .select({ followingId: followers.followingId })
        .from(followers)
        .where(eq(followers.followerId, userId));

      return db
        .select()
        .from(posts)
        .where(
          or(eq(posts.userId, userId), inArray(posts.userId, followedUsers)),
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async getByUserId(userId: string, limit: number = 50): Promise<Post[]> {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  },

  async update(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  },

  async like(postId: string, userId: string): Promise<boolean> {
    try {
      await db.insert(postLikes).values({ postId, userId });
      return true;
    } catch (error) {
      return false; // Already liked
    }
  },

  async unlike(postId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return result.rowCount > 0;
  },

  async getLikes(postId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));
    return result.count;
  },

  async isLiked(postId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return !!like;
  },

  async addComment(postId: string, userId: string, content: string) {
    const [comment] = await db
      .insert(postComments)
      .values({ postId, userId, content })
      .returning();
    return comment;
  },

  async getComments(postId: string): Promise<any[]> {
    return db
      .select({
        id: postComments.id,
        content: postComments.content,
        createdAt: postComments.createdAt,
        user: {
          id: profiles.userId,
          name: profiles.name,
          username: profiles.username,
          avatar: profiles.avatarUrl,
        },
      })
      .from(postComments)
      .leftJoin(profiles, eq(postComments.userId, profiles.userId))
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt));
  },
};

// Product operations
export const productOperations = {
  async create(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  },

  async findById(id: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  },

  async search(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sellerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sellerId,
      limit = 50,
      offset = 0,
    } = filters;

    let query = db.select().from(products);
    const conditions = [];

    if (category) conditions.push(eq(products.category, category));
    if (minPrice !== undefined)
      conditions.push(gte(products.price, minPrice.toString()));
    if (maxPrice !== undefined)
      conditions.push(lte(products.price, maxPrice.toString()));
    if (search) conditions.push(like(products.name, `%${search}%`));
    if (sellerId) conditions.push(eq(products.sellerId, sellerId));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(desc(products.createdAt)).limit(limit).offset(offset);
  },

  async update(
    id: string,
    updates: Partial<Product>,
  ): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  },

  async getFeatured(limit: number = 20): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  },

  async getSponsored(limit: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.isSponsored, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  },
};

// Follow operations
export const followOperations = {
  async follow(followerId: string, followingId: string): Promise<boolean> {
    try {
      await db.insert(followers).values({ followerId, followingId });
      return true;
    } catch (error) {
      return false; // Already following
    }
  },

  async unfollow(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .delete(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId),
        ),
      );
    return result.rowCount > 0;
  },

  async getFollowers(userId: string): Promise<string[]> {
    const result = await db
      .select({ followerId: followers.followerId })
      .from(followers)
      .where(eq(followers.followingId, userId));
    return result.map((r) => r.followerId);
  },

  async getFollowing(userId: string): Promise<string[]> {
    const result = await db
      .select({ followingId: followers.followingId })
      .from(followers)
      .where(eq(followers.followerId, userId));
    return result.map((r) => r.followingId);
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId),
        ),
      );
    return !!follow;
  },

  async getFollowCounts(
    userId: string,
  ): Promise<{ followers: number; following: number }> {
    const [followersCount] = await db
      .select({ count: count() })
      .from(followers)
      .where(eq(followers.followingId, userId));

    const [followingCount] = await db
      .select({ count: count() })
      .from(followers)
      .where(eq(followers.followerId, userId));

    return {
      followers: followersCount.count,
      following: followingCount.count,
    };
  },
};

// Freelance operations
export const freelanceOperations = {
  async createJob(jobData: InsertFreelanceJob): Promise<FreelanceJob> {
    const [job] = await db.insert(freelanceJobs).values(jobData).returning();
    return job;
  },

  async searchJobs(filters: {
    category?: string;
    experienceLevel?: string[];
    budgetMin?: number;
    budgetMax?: number;
    skills?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FreelanceJob[]> {
    const {
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      skills,
      search,
      limit = 50,
      offset = 0,
    } = filters;

    let query = db.select().from(freelanceJobs);
    const conditions = [eq(freelanceJobs.status, "open")];

    if (category) conditions.push(eq(freelanceJobs.category, category));
    if (experienceLevel?.length)
      conditions.push(inArray(freelanceJobs.experienceLevel, experienceLevel));
    if (budgetMin !== undefined)
      conditions.push(gte(freelanceJobs.budgetMin, budgetMin.toString()));
    if (budgetMax !== undefined)
      conditions.push(lte(freelanceJobs.budgetMax, budgetMax.toString()));
    if (search)
      conditions.push(
        or(
          like(freelanceJobs.title, `%${search}%`),
          like(freelanceJobs.description, `%${search}%`),
        ),
      );

    query = query.where(and(...conditions));

    return query
      .orderBy(desc(freelanceJobs.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async submitProposal(proposalData: any) {
    const [proposal] = await db
      .insert(freelanceProposals)
      .values(proposalData)
      .returning();

    // Update job application count
    await db
      .update(freelanceJobs)
      .set({
        applicationsCount: sql`${freelanceJobs.applicationsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(freelanceJobs.id, proposalData.jobId));

    return proposal;
  },

  async getProposals(jobId: string) {
    return db
      .select({
        id: freelanceProposals.id,
        coverLetter: freelanceProposals.coverLetter,
        proposedAmount: freelanceProposals.proposedAmount,
        deliveryTime: freelanceProposals.deliveryTime,
        status: freelanceProposals.status,
        submittedAt: freelanceProposals.submittedAt,
        freelancer: {
          id: profiles.userId,
          name: profiles.name,
          username: profiles.username,
          avatar: profiles.avatarUrl,
          rating: profiles.level, // You might want to add a rating field
        },
      })
      .from(freelanceProposals)
      .leftJoin(profiles, eq(freelanceProposals.freelancerId, profiles.userId))
      .where(eq(freelanceProposals.jobId, jobId))
      .orderBy(desc(freelanceProposals.submittedAt));
  },
};

// Notification operations
export const notificationOperations = {
  async create(notificationData: {
    userId: string;
    title: string;
    content: string;
    type: string;
    relatedUserId?: string;
    relatedPostId?: string;
  }) {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  },

  async getUserNotifications(userId: string, limit: number = 50) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return result.rowCount > 0;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
    return result.rowCount > 0;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false)),
      );
    return result.count;
  },
};

// Search operations
export const searchOperations = {
  async searchAll(query: string, limit: number = 20) {
    const searchTerm = `%${query}%`;

    const [userResults, postResults, productResults, jobResults] =
      await Promise.all([
        // Search users
        db
          .select({
            id: profiles.userId,
            type: sql<"user">`'user'`,
            title: profiles.name,
            subtitle: profiles.username,
            avatar: profiles.avatarUrl,
            description: profiles.bio,
          })
          .from(profiles)
          .where(
            or(
              like(profiles.name, searchTerm),
              like(profiles.username, searchTerm),
              like(profiles.bio, searchTerm),
            ),
          )
          .limit(limit),

        // Search posts
        db
          .select({
            id: posts.id,
            type: sql<"post">`'post'`,
            title: sql<string>`substr(${posts.content}, 1, 50)`,
            subtitle: sql<string>`NULL`,
            avatar: sql<string>`NULL`,
            description: posts.content,
          })
          .from(posts)
          .where(like(posts.content, searchTerm))
          .limit(limit),

        // Search products
        db
          .select({
            id: products.id,
            type: sql<"product">`'product'`,
            title: products.name,
            subtitle: products.category,
            avatar: products.imageUrl,
            description: products.description,
          })
          .from(products)
          .where(
            or(
              like(products.name, searchTerm),
              like(products.description, searchTerm),
              like(products.category, searchTerm),
            ),
          )
          .limit(limit),

        // Search freelance jobs
        db
          .select({
            id: freelanceJobs.id,
            type: sql<"job">`'job'`,
            title: freelanceJobs.title,
            subtitle: freelanceJobs.category,
            avatar: sql<string>`NULL`,
            description: freelanceJobs.description,
          })
          .from(freelanceJobs)
          .where(
            or(
              like(freelanceJobs.title, searchTerm),
              like(freelanceJobs.description, searchTerm),
              like(freelanceJobs.category, searchTerm),
            ),
          )
          .limit(limit),
      ]);

    return {
      users: userResults,
      posts: postResults,
      products: productResults,
      jobs: jobResults,
    };
  },
};
