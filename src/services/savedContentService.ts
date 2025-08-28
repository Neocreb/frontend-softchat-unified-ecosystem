interface SavedPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  liked?: boolean;
  bookmarked?: boolean;
  gifted?: boolean;
  image?: string;
  type: 'post';
  savedAt: string; // When it was saved
}

interface ViewHistoryItem {
  id: string;
  postId: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  image?: string;
  viewedAt: string; // When it was viewed
  duration?: number; // How long it was viewed (in seconds)
}

class SavedContentService {
  private static SAVED_POSTS_KEY = 'eloity_saved_posts';
  private static VIEW_HISTORY_KEY = 'eloity_view_history';
  private static MAX_HISTORY_ITEMS = 100;

  // Saved Posts Management
  static getSavedPosts(): SavedPost[] {
    try {
      const saved = localStorage.getItem(this.SAVED_POSTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting saved posts:', error);
      return [];
    }
  }

  static savePost(post: Omit<SavedPost, 'savedAt'>): boolean {
    try {
      const savedPosts = this.getSavedPosts();
      
      // Check if already saved
      if (savedPosts.some(p => p.id === post.id)) {
        return false; // Already saved
      }

      const savedPost: SavedPost = {
        ...post,
        savedAt: new Date().toISOString(),
      };

      savedPosts.unshift(savedPost); // Add to beginning
      localStorage.setItem(this.SAVED_POSTS_KEY, JSON.stringify(savedPosts));
      
      return true;
    } catch (error) {
      console.error('Error saving post:', error);
      return false;
    }
  }

  static unsavePost(postId: string): boolean {
    try {
      const savedPosts = this.getSavedPosts();
      const filteredPosts = savedPosts.filter(p => p.id !== postId);
      
      localStorage.setItem(this.SAVED_POSTS_KEY, JSON.stringify(filteredPosts));
      return true;
    } catch (error) {
      console.error('Error unsaving post:', error);
      return false;
    }
  }

  static isPostSaved(postId: string): boolean {
    const savedPosts = this.getSavedPosts();
    return savedPosts.some(p => p.id === postId);
  }

  static getSavedPostsByCategory(category?: string): SavedPost[] {
    // Future enhancement: categorize saved posts
    return this.getSavedPosts();
  }

  static clearAllSavedPosts(): boolean {
    try {
      localStorage.removeItem(this.SAVED_POSTS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing saved posts:', error);
      return false;
    }
  }

  // View History Management
  static getViewHistory(): ViewHistoryItem[] {
    try {
      const history = localStorage.getItem(this.VIEW_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting view history:', error);
      return [];
    }
  }

  static addToViewHistory(post: Omit<ViewHistoryItem, 'viewedAt' | 'duration'>, duration?: number): boolean {
    try {
      const history = this.getViewHistory();
      
      // Remove if already in history to avoid duplicates
      const filteredHistory = history.filter(item => item.postId !== post.postId);
      
      const historyItem: ViewHistoryItem = {
        ...post,
        viewedAt: new Date().toISOString(),
        duration: duration || 0,
      };

      filteredHistory.unshift(historyItem); // Add to beginning
      
      // Keep only the latest MAX_HISTORY_ITEMS
      const trimmedHistory = filteredHistory.slice(0, this.MAX_HISTORY_ITEMS);
      
      localStorage.setItem(this.VIEW_HISTORY_KEY, JSON.stringify(trimmedHistory));
      return true;
    } catch (error) {
      console.error('Error adding to view history:', error);
      return false;
    }
  }

  static removeFromViewHistory(postId: string): boolean {
    try {
      const history = this.getViewHistory();
      const filteredHistory = history.filter(item => item.postId !== postId);
      
      localStorage.setItem(this.VIEW_HISTORY_KEY, JSON.stringify(filteredHistory));
      return true;
    } catch (error) {
      console.error('Error removing from view history:', error);
      return false;
    }
  }

  static clearViewHistory(): boolean {
    try {
      localStorage.removeItem(this.VIEW_HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing view history:', error);
      return false;
    }
  }

  static getViewHistoryByDateRange(startDate: Date, endDate: Date): ViewHistoryItem[] {
    const history = this.getViewHistory();
    return history.filter(item => {
      const viewedDate = new Date(item.viewedAt);
      return viewedDate >= startDate && viewedDate <= endDate;
    });
  }

  static getViewHistoryStats() {
    const history = this.getViewHistory();
    const totalViews = history.length;
    const totalDuration = history.reduce((sum, item) => sum + (item.duration || 0), 0);
    const averageDuration = totalViews > 0 ? totalDuration / totalViews : 0;
    
    // Group by author
    const authorStats = history.reduce((stats, item) => {
      const author = item.author.username;
      if (!stats[author]) {
        stats[author] = {
          name: item.author.name,
          username: author,
          avatar: item.author.avatar,
          viewCount: 0,
          totalDuration: 0,
        };
      }
      stats[author].viewCount++;
      stats[author].totalDuration += item.duration || 0;
      return stats;
    }, {} as Record<string, any>);

    // Get most viewed authors
    const topAuthors = Object.values(authorStats)
      .sort((a: any, b: any) => b.viewCount - a.viewCount)
      .slice(0, 5);

    return {
      totalViews,
      totalDuration,
      averageDuration,
      topAuthors,
    };
  }

  // Search functionality
  static searchSavedPosts(query: string): SavedPost[] {
    const savedPosts = this.getSavedPosts();
    const lowercaseQuery = query.toLowerCase();
    
    return savedPosts.filter(post => 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.author.name.toLowerCase().includes(lowercaseQuery) ||
      post.author.username.toLowerCase().includes(lowercaseQuery)
    );
  }

  static searchViewHistory(query: string): ViewHistoryItem[] {
    const history = this.getViewHistory();
    const lowercaseQuery = query.toLowerCase();
    
    return history.filter(item => 
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.author.name.toLowerCase().includes(lowercaseQuery) ||
      item.author.username.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Export/Import functionality
  static exportSavedPosts(): string {
    const savedPosts = this.getSavedPosts();
    return JSON.stringify(savedPosts, null, 2);
  }

  static exportViewHistory(): string {
    const history = this.getViewHistory();
    return JSON.stringify(history, null, 2);
  }

  static importSavedPosts(jsonData: string): boolean {
    try {
      const posts = JSON.parse(jsonData);
      if (Array.isArray(posts)) {
        localStorage.setItem(this.SAVED_POSTS_KEY, JSON.stringify(posts));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing saved posts:', error);
      return false;
    }
  }

  static importViewHistory(jsonData: string): boolean {
    try {
      const history = JSON.parse(jsonData);
      if (Array.isArray(history)) {
        localStorage.setItem(this.VIEW_HISTORY_KEY, JSON.stringify(history));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing view history:', error);
      return false;
    }
  }

  // Utility methods
  static getStorageSize(): { savedPosts: number; viewHistory: number; total: number } {
    const savedPostsSize = new Blob([localStorage.getItem(this.SAVED_POSTS_KEY) || '']).size;
    const viewHistorySize = new Blob([localStorage.getItem(this.VIEW_HISTORY_KEY) || '']).size;
    
    return {
      savedPosts: savedPostsSize,
      viewHistory: viewHistorySize,
      total: savedPostsSize + viewHistorySize,
    };
  }

  static cleanupOldHistory(daysToKeep: number = 30): number {
    try {
      const history = this.getViewHistory();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filteredHistory = history.filter(item => 
        new Date(item.viewedAt) >= cutoffDate
      );
      
      const removedCount = history.length - filteredHistory.length;
      
      if (removedCount > 0) {
        localStorage.setItem(this.VIEW_HISTORY_KEY, JSON.stringify(filteredHistory));
      }
      
      return removedCount;
    } catch (error) {
      console.error('Error cleaning up old history:', error);
      return 0;
    }
  }
}

export default SavedContentService;
export type { SavedPost, ViewHistoryItem };
