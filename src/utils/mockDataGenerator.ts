// Generate dynamic mock data based on group/page ID

const authors = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    role: "admin" as const,
    joinedAt: "2023-01-15"
  },
  {
    id: "2", 
    name: "Sarah Kim",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100",
    role: "member" as const,
    joinedAt: "2023-02-01"
  },
  {
    id: "3",
    name: "Mike Johnson", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "member" as const,
    joinedAt: "2023-03-10"
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    role: "member" as const,
    joinedAt: "2023-04-20"
  }
];

const postTemplates = [
  {
    content: "🚀 Exciting news! Just launched a new project that I've been working on. Would love to get your feedback and thoughts!",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"]
  },
  {
    content: "Great discussion today about best practices. Here are some key takeaways that I thought worth sharing with everyone.",
    images: []
  },
  {
    content: "Amazing community event yesterday! Thanks to everyone who participated. Looking forward to the next one! 🎉",
    images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400"]
  },
  {
    content: "Question for the community: What's your experience with [topic]? I'm curious to learn from your insights.",
    images: []
  },
  {
    content: "Sharing some resources that I found helpful recently. Hope this helps others in the community too! 📚",
    images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"]
  }
];

export const generateMockPosts = (groupId: string, count: number = 3) => {
  const posts = [];
  
  for (let i = 0; i < count; i++) {
    const author = authors[i % authors.length];
    const template = postTemplates[i % postTemplates.length];
    const timeOffset = i * 2 * 60 * 60 * 1000; // 2 hours apart
    
    posts.push({
      id: `${groupId}-post-${i + 1}`,
      author,
      content: template.content,
      images: template.images,
      timestamp: new Date(Date.now() - timeOffset).toISOString(),
      likes: Math.floor(Math.random() * 200) + 10,
      isLiked: Math.random() > 0.7,
      isPinned: i === 0, // First post is pinned
      comments: generateMockComments(Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return posts;
};

export const generateMockComments = (count: number = 2) => {
  const comments = [];
  
  for (let i = 0; i < count; i++) {
    const author = authors[(i + 1) % authors.length];
    const commentTexts = [
      "Great point! I totally agree with this approach.",
      "Thanks for sharing this, really helpful insights.",
      "I had a similar experience, would love to discuss more.",
      "This is exactly what I was looking for, appreciate it!",
      "Interesting perspective, I hadn't thought of it that way."
    ];
    
    comments.push({
      id: `comment-${i + 1}`,
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar
      },
      content: commentTexts[i % commentTexts.length],
      timestamp: new Date(Date.now() - (i * 30 * 60 * 1000)).toISOString(), // 30 minutes apart
      likes: Math.floor(Math.random() * 20) + 1,
      isLiked: Math.random() > 0.8
    });
  }
  
  return comments;
};

export const generateMockEvents = (groupId: string, count: number = 2) => {
  const events = [];
  const eventTemplates = [
    {
      title: "Community Meetup",
      description: "Join us for our monthly community meetup to network and share ideas",
      location: "Virtual Event",
      cover: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400"
    },
    {
      title: "Workshop Session", 
      description: "Hands-on workshop covering advanced topics and best practices",
      location: "Community Center",
      cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
    }
  ];
  
  for (let i = 0; i < count; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (i + 1) * 7); // 1 week intervals
    
    events.push({
      id: `${groupId}-event-${i + 1}`,
      title: template.title,
      description: template.description,
      date: futureDate.toISOString().split('T')[0],
      time: i === 0 ? "14:00" : "18:00",
      location: template.location,
      attendees: Math.floor(Math.random() * 150) + 20,
      isAttending: Math.random() > 0.6,
      cover: template.cover
    });
  }
  
  return events;
};

export const generateMockMembers = (groupId: string, count: number = 5) => {
  return authors.slice(0, count).map(author => ({
    ...author,
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));
};
