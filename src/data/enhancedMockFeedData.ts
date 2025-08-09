export const enhancedMockFeedData = [
  // Regular Post
  {
    id: "post-1",
    content: "Just finished an amazing project! The new React hooks made everything so much cleaner. Excited to share my learnings with the community! 🚀",
    author: {
      name: "Sarah Chen",
      username: "sarahc_dev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
    createdAt: "2h",
    likes: 45,
    comments: 12,
    shares: 8,
    gifts: 3,
    contentType: "post",
  },

  // Product
  {
    id: "product-1",
    content: "🎧 Brand new wireless headphones with active noise cancellation! Perfect for remote work or just enjoying your favorite music. Limited time offer!",
    author: {
      name: "TechStore Official",
      username: "techstore",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    createdAt: "4h",
    likes: 89,
    comments: 23,
    shares: 15,
    gifts: 2,
    contentType: "product",
    productId: "prod-123",
    price: 149.99,
    currency: "USD",
    category: "Electronics",
  },

  // Job Posting
  {
    id: "job-1",
    content: "🚀 We're hiring a Senior Frontend Developer! Join our amazing team and work on cutting-edge projects. Remote-friendly with great benefits and growth opportunities!",
    author: {
      name: "StartupCorp",
      username: "startupcorp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      verified: true,
    },
    createdAt: "1d",
    likes: 156,
    comments: 45,
    shares: 67,
    gifts: 8,
    contentType: "job",
    jobId: "job-456",
    jobType: "fulltime",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    location: "Remote / San Francisco",
  },

  // Event
  {
    id: "event-1",
    content: "🎪 Join us for the biggest tech conference of the year! Amazing speakers, networking opportunities, and hands-on workshops. Early bird tickets available now!",
    author: {
      name: "TechConf 2024",
      username: "techconf2024",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
    createdAt: "1d",
    likes: 234,
    comments: 67,
    shares: 89,
    gifts: 12,
    contentType: "event",
    eventId: "event-789",
    eventDate: "2024-03-15T09:00:00",
    location: "San Francisco, CA",
    price: 299,
    currency: "USD",
  },

  // Freelance Service
  {
    id: "service-1",
    content: "💻 Professional web development services available! I specialize in React, Node.js, and full-stack applications. Let's bring your ideas to life!",
    author: {
      name: "Alex Rodriguez",
      username: "alex_codes",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      verified: false,
    },
    createdAt: "6h",
    likes: 78,
    comments: 19,
    shares: 25,
    gifts: 5,
    contentType: "service",
    serviceId: "service-321",
    jobType: "freelance",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    price: 75,
    currency: "USD",
  },

  // Live Stream
  {
    id: "livestream-1",
    content: "🔴 LIVE NOW: Building a React app from scratch! Join me as I code and explain best practices. Great for beginners and intermediate developers!",
    author: {
      name: "CodeWithMaya",
      username: "maya_codes",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500",
    createdAt: "30m",
    likes: 345,
    comments: 123,
    shares: 45,
    gifts: 67,
    contentType: "livestream",
    livestreamId: "live-555",
    isLive: true,
  },

  // Video
  {
    id: "video-1",
    content: "📹 New tutorial is out! Learn how to build a full-stack application with modern tools. Perfect for those looking to level up their skills!",
    author: {
      name: "DevTutorials",
      username: "dev_tutorials",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      verified: true,
    },
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
    createdAt: "8h",
    likes: 189,
    comments: 34,
    shares: 56,
    gifts: 23,
    contentType: "video",
    videoId: "video-777",
  },

  // Another Product with different category
  {
    id: "product-2",
    content: "🎨 Beautiful handcrafted pottery pieces! Each one is unique and made with love. Perfect for home decoration or as gifts for your loved ones.",
    author: {
      name: "ArtisanCrafts",
      username: "artisan_crafts",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      verified: false,
    },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    createdAt: "12h",
    likes: 67,
    comments: 15,
    shares: 8,
    gifts: 12,
    contentType: "product",
    productId: "prod-456",
    price: 45,
    currency: "USD",
    category: "Art & Crafts",
  },

  // Another Job - Contract
  {
    id: "job-2",
    content: "💼 Looking for a talented UX/UI Designer for a 3-month contract project. Work with a dynamic team on an exciting fintech application!",
    author: {
      name: "DesignAgency",
      username: "design_agency",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      verified: true,
    },
    createdAt: "2d",
    likes: 89,
    comments: 29,
    shares: 34,
    gifts: 4,
    contentType: "job",
    jobId: "job-789",
    jobType: "contract",
    skills: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
    location: "Remote",
    price: 5000,
    currency: "USD",
  },

  // Regular inspiring post
  {
    id: "post-2",
    content: "Just want to remind everyone that every expert was once a beginner. Keep learning, keep growing, and don't be afraid to make mistakes. That's how we all improve! 💪✨",
    author: {
      name: "Motivational Mike",
      username: "motivation_mike",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      verified: false,
    },
    createdAt: "1d",
    likes: 456,
    comments: 89,
    shares: 123,
    gifts: 34,
    contentType: "post",
  },
];

// Threaded version for EnhancedFeedContext
export const enhancedThreadedMockData = enhancedMockFeedData.map(post => ({
  ...post,
  isReply: false,
  type: 'post' as const,
  depth: 0,
}));
