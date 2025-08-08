// Utility functions for feed formatting and content management

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }
  
  return date.toLocaleDateString();
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateEngagementScore = (likes: number, comments: number, shares: number, views?: number): number => {
  const likeWeight = 1;
  const commentWeight = 3; // Comments are more valuable
  const shareWeight = 5; // Shares are most valuable
  const viewWeight = 0.1; // Views have low weight
  
  return (
    likes * likeWeight +
    comments * commentWeight +
    shares * shareWeight +
    (views || 0) * viewWeight
  );
};

export const getContentPriority = (
  type: string,
  timestamp: Date,
  engagement: { likes: number; comments: number; shares: number; views?: number },
  isSponsored: boolean = false,
  isFromFollowing: boolean = false
): number => {
  let basePriority = 5;
  
  // Type-based priority
  switch (type) {
    case 'live_event':
      basePriority = 10;
      break;
    case 'post':
      basePriority = 8;
      break;
    case 'community_event':
      basePriority = 7;
      break;
    case 'job':
    case 'freelancer_skill':
      basePriority = 6;
      break;
    case 'product':
      basePriority = 5;
      break;
    case 'sponsored_post':
      basePriority = 4;
      break;
    default:
      basePriority = 5;
  }
  
  // Boost for content from followed users
  if (isFromFollowing) {
    basePriority += 2;
  }
  
  // Sponsored content gets specific placement
  if (isSponsored) {
    basePriority = 4;
  }
  
  // Engagement boost
  const engagementScore = calculateEngagementScore(
    engagement.likes,
    engagement.comments,
    engagement.shares,
    engagement.views
  );
  const engagementBoost = Math.min(Math.log10(engagementScore + 1), 3);
  
  // Recency boost - newer content gets slight priority
  const hoursSincePost = (new Date().getTime() - timestamp.getTime()) / (1000 * 60 * 60);
  const recencyBoost = Math.max(0, 2 - hoursSincePost / 12); // Boost decreases over 24 hours
  
  return basePriority + engagementBoost + recencyBoost;
};

export const mixContentIntelligently = <T extends { type: string; priority: number }>(
  items: T[],
  targetDistribution?: {
    posts: number;
    products: number;
    jobs: number;
    ads: number;
    events: number;
  }
): T[] => {
  const distribution = targetDistribution || {
    posts: 60,      // 60% posts
    products: 15,   // 15% product recommendations
    jobs: 10,       // 10% job/freelancer content
    ads: 10,        // 10% sponsored content
    events: 5,      // 5% events
  };
  
  // Group items by type
  const groupedItems: { [key: string]: T[] } = {};
  items.forEach(item => {
    const category = getCategoryFromType(item.type);
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });
  
  // Sort each group by priority
  Object.keys(groupedItems).forEach(category => {
    groupedItems[category].sort((a, b) => b.priority - a.priority);
  });
  
  // Mix items according to distribution
  const mixed: T[] = [];
  const totalItems = items.length;
  
  for (let i = 0; i < totalItems; i++) {
    const position = i / totalItems;
    let selectedCategory = 'posts';
    
    // Determine which category to pick from based on position and distribution
    if (position < distribution.posts / 100) {
      selectedCategory = 'posts';
    } else if (position < (distribution.posts + distribution.products) / 100) {
      selectedCategory = 'products';
    } else if (position < (distribution.posts + distribution.products + distribution.jobs) / 100) {
      selectedCategory = 'jobs';
    } else if (position < (distribution.posts + distribution.products + distribution.jobs + distribution.ads) / 100) {
      selectedCategory = 'ads';
    } else {
      selectedCategory = 'events';
    }
    
    // Pick the next item from the selected category
    if (groupedItems[selectedCategory] && groupedItems[selectedCategory].length > 0) {
      mixed.push(groupedItems[selectedCategory].shift()!);
    } else {
      // If category is empty, pick from any available category
      const availableCategories = Object.keys(groupedItems).filter(
        cat => groupedItems[cat].length > 0
      );
      if (availableCategories.length > 0) {
        const fallbackCategory = availableCategories[0];
        mixed.push(groupedItems[fallbackCategory].shift()!);
      }
    }
  }
  
  return mixed;
};

const getCategoryFromType = (type: string): string => {
  switch (type) {
    case 'post':
      return 'posts';
    case 'product':
      return 'products';
    case 'job':
    case 'freelancer_skill':
      return 'jobs';
    case 'sponsored_post':
    case 'ad':
      return 'ads';
    case 'live_event':
    case 'community_event':
      return 'events';
    default:
      return 'posts';
  }
};

export const generateMockContent = (count: number = 20) => {
  const contentTypes = [
    'post',
    'product', 
    'job',
    'freelancer_skill',
    'sponsored_post',
    'live_event',
    'community_event'
  ];
  
  const mockItems = [];
  
  for (let i = 0; i < count; i++) {
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000); // Random time in last 24 hours
    
    const engagement = {
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
    };
    
    const priority = getContentPriority(type, timestamp, engagement);
    
    mockItems.push({
      id: `item-${i}`,
      type,
      timestamp,
      priority,
      engagement,
      // Add other mock properties as needed
    });
  }
  
  return mockItems;
};

export const filterContentByFeedType = <T extends { type: string; author?: any }>(
  items: T[],
  feedType: string
): T[] => {
  switch (feedType) {
    case 'following':
      // Show content from verified users (simulating followed users) and some events
      return items.filter(item => 
        item.author?.verified || 
        item.type === 'community_event' ||
        item.type === 'live_event'
      );
      
    case 'groups':
      // Show community events and some posts (simulating group content)
      return items.filter(item => 
        item.type === 'community_event' || 
        item.type === 'live_event' ||
        (item.type === 'post' && Math.random() > 0.3)
      );
      
    case 'pages':
      // Show business/page content
      return items.filter(item => 
        item.type === 'product' || 
        item.type === 'job' || 
        item.type === 'freelancer_skill' ||
        item.type === 'sponsored_post' ||
        (item.type === 'post' && item.author?.verified)
      );
      
    default: // 'for-you'
      return items;
  }
};

export const addAdPlacements = <T extends { type: string }>(
  items: T[],
  adFrequency: number = 7
): T[] => {
  // This would insert ads at specific intervals
  // For now, just return the items as they contain sponsored content
  return items;
};
