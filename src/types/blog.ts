export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: BlogCategory;
  featuredImage?: string;
  readingTime: number;
  likes: number;
  views: number;
  status: "draft" | "published" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  relatedAssets?: string[]; // For crypto-related posts
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  publishedAt: string;
  likes: number;
  replies?: BlogComment[];
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topCategories: Array<{
    category: BlogCategory;
    postCount: number;
  }>;
}

export interface RSSFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
  tags: string[];
  author: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  relatedAssets?: string[];
}
