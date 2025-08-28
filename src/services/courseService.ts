import {
  BookOpen,
  TrendingUp,
  Target,
  Shield,
  Brain,
  Play,
  FileText,
  CheckCircle2,
  Video,
  Quiz,
  Download
} from "lucide-react";
import { getCompleteCoursesWithExtendedData } from "./courseDataExtension";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  duration: number; // in minutes
  content: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  completed: boolean;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
  lessons: Lesson[];
  totalLessons: number;
  icon: any;
  color: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  objectives: string[];
  requirements: string[];
  tags: string[];
  enrolled: boolean;
  progress: number; // 0-100
  completedLessons: number;
  certificate: boolean;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  progress: number;
  lastAccessed: Date;
  timeSpent: number; // in minutes
  quizScores: { [lessonId: string]: number };
}

// Mock course data with comprehensive lessons
const mockCourses: Course[] = [
  {
    id: "crypto-basics",
    title: "Cryptocurrency Basics",
    description: "Learn the fundamentals of digital currencies and blockchain technology",
    level: "Beginner",
    duration: "2 hours",
    students: 1250,
    rating: 4.8,
    totalLessons: 8,
    icon: BookOpen,
    color: "from-green-500 to-emerald-600",
    instructor: {
      name: "Sarah Johnson",
      title: "Blockchain Expert",
      avatar: "/api/placeholder/64/64",
      bio: "Former Goldman Sachs analyst with 8+ years in crypto markets"
    },
    objectives: [
      "Understand what cryptocurrency is and how it works",
      "Learn about blockchain technology and its applications",
      "Identify different types of cryptocurrencies",
      "Understand wallet security and best practices"
    ],
    requirements: [
      "Basic computer literacy",
      "Internet connection",
      "Open mind to new technology"
    ],
    tags: ["cryptocurrency", "blockchain", "basics", "beginner"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "lesson-1",
        title: "What is Cryptocurrency?",
        description: "Introduction to digital currencies and their purpose",
        type: "video",
        duration: 15,
        content: "Cryptocurrency is a digital or virtual form of currency that uses cryptography for security...",
        videoUrl: "https://example.com/crypto-intro.mp4",
        completed: false,
        order: 1
      },
      {
        id: "lesson-2",
        title: "Understanding Blockchain Technology",
        description: "Learn how blockchain works as the foundation of crypto",
        type: "video",
        duration: 20,
        content: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records...",
        videoUrl: "https://example.com/blockchain-intro.mp4",
        completed: false,
        order: 2
      },
      {
        id: "lesson-3",
        title: "Bitcoin: The First Cryptocurrency",
        description: "Deep dive into Bitcoin and its significance",
        type: "text",
        duration: 12,
        content: "Bitcoin was created in 2009 by an anonymous person or group known as Satoshi Nakamoto...",
        completed: false,
        order: 3
      },
      {
        id: "lesson-4",
        title: "Types of Cryptocurrencies",
        description: "Explore different categories of digital assets",
        type: "interactive",
        duration: 18,
        content: "Learn about various cryptocurrency categories including coins, tokens, stablecoins, and NFTs...",
        completed: false,
        order: 4
      },
      {
        id: "lesson-5",
        title: "Quiz: Crypto Fundamentals",
        description: "Test your knowledge of cryptocurrency basics",
        type: "quiz",
        duration: 10,
        content: "Assessment quiz covering the fundamentals of cryptocurrency",
        quizQuestions: [
          {
            id: "q1",
            question: "What technology underlies most cryptocurrencies?",
            options: ["Internet", "Blockchain", "Cloud Computing", "Artificial Intelligence"],
            correctAnswer: 1,
            explanation: "Blockchain technology is the distributed ledger system that underlies most cryptocurrencies."
          },
          {
            id: "q2",
            question: "Who created Bitcoin?",
            options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Roger Ver"],
            correctAnswer: 1,
            explanation: "Satoshi Nakamoto is the pseudonymous creator of Bitcoin."
          }
        ],
        completed: false,
        order: 5
      },
      {
        id: "lesson-6",
        title: "Crypto Wallets and Security",
        description: "Learn how to safely store your cryptocurrencies",
        type: "video",
        duration: 25,
        content: "A cryptocurrency wallet is a software program or physical device that stores your private keys...",
        videoUrl: "https://example.com/crypto-wallets.mp4",
        completed: false,
        order: 6
      },
      {
        id: "lesson-7",
        title: "Making Your First Transaction",
        description: "Step-by-step guide to sending and receiving crypto",
        type: "interactive",
        duration: 20,
        content: "Learn how to safely send and receive cryptocurrency transactions...",
        completed: false,
        order: 7
      },
      {
        id: "lesson-8",
        title: "Security Best Practices",
        description: "Protect your investments with proper security measures",
        type: "text",
        duration: 15,
        content: "Security is paramount in the cryptocurrency world. Here are essential practices to protect your assets...",
        completed: false,
        order: 8
      }
    ]
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis Mastery",
    description: "Master chart patterns, indicators, and trading strategies",
    level: "Intermediate",
    duration: "4 hours",
    students: 890,
    rating: 4.9,
    totalLessons: 12,
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-600",
    instructor: {
      name: "Michael Chen",
      title: "Professional Trader",
      avatar: "/api/placeholder/64/64",
      bio: "15+ years trading experience with institutional and retail clients"
    },
    objectives: [
      "Read and analyze crypto price charts",
      "Identify key support and resistance levels",
      "Use technical indicators effectively",
      "Develop profitable trading strategies"
    ],
    requirements: [
      "Basic understanding of cryptocurrency",
      "Familiarity with trading platforms",
      "Mathematical aptitude"
    ],
    tags: ["trading", "technical analysis", "charts", "indicators"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "ta-lesson-1",
        title: "Introduction to Technical Analysis",
        description: "Understanding price action and market psychology",
        type: "video",
        duration: 20,
        content: "Technical analysis is the study of price movements to predict future market behavior...",
        videoUrl: "https://example.com/ta-intro.mp4",
        completed: false,
        order: 1
      },
      {
        id: "ta-lesson-2",
        title: "Reading Candlestick Charts",
        description: "Master the art of candlestick pattern recognition",
        type: "interactive",
        duration: 25,
        content: "Candlestick charts provide crucial information about market sentiment...",
        completed: false,
        order: 2
      },
      {
        id: "ta-lesson-3",
        title: "Support and Resistance Levels",
        description: "Identify key price levels that matter",
        type: "video",
        duration: 18,
        content: "Support and resistance levels are fundamental concepts in technical analysis...",
        videoUrl: "https://example.com/support-resistance.mp4",
        completed: false,
        order: 3
      },
      {
        id: "ta-lesson-4",
        title: "Moving Averages",
        description: "Learn to use moving averages for trend analysis",
        type: "text",
        duration: 15,
        content: "Moving averages smooth out price data to help identify trend direction...",
        completed: false,
        order: 4
      },
      {
        id: "ta-lesson-5",
        title: "RSI and Momentum Indicators",
        description: "Master oscillators for market timing",
        type: "video",
        duration: 22,
        content: "RSI and other momentum indicators help identify overbought and oversold conditions...",
        videoUrl: "https://example.com/rsi-indicators.mp4",
        completed: false,
        order: 5
      },
      {
        id: "ta-lesson-6",
        title: "Quiz: Technical Indicators",
        description: "Test your understanding of technical analysis tools",
        type: "quiz",
        duration: 12,
        content: "Assessment covering technical indicators and their applications",
        quizQuestions: [
          {
            id: "ta-q1",
            question: "What does RSI measure?",
            options: ["Price momentum", "Volume", "Volatility", "Market cap"],
            correctAnswer: 0,
            explanation: "RSI (Relative Strength Index) measures price momentum to identify overbought/oversold conditions."
          }
        ],
        completed: false,
        order: 6
      },
      {
        id: "ta-lesson-7",
        title: "Chart Patterns",
        description: "Recognize profitable trading patterns",
        type: "interactive",
        duration: 30,
        content: "Chart patterns reveal market psychology and potential price movements...",
        completed: false,
        order: 7
      },
      {
        id: "ta-lesson-8",
        title: "Volume Analysis",
        description: "Use volume to confirm price movements",
        type: "video",
        duration: 16,
        content: "Volume analysis helps confirm the strength of price movements...",
        videoUrl: "https://example.com/volume-analysis.mp4",
        completed: false,
        order: 8
      },
      {
        id: "ta-lesson-9",
        title: "Risk Management in Trading",
        description: "Protect your capital with proper risk management",
        type: "text",
        duration: 20,
        content: "Risk management is the most important aspect of successful trading...",
        completed: false,
        order: 9
      },
      {
        id: "ta-lesson-10",
        title: "Building Trading Strategies",
        description: "Combine indicators into profitable strategies",
        type: "interactive",
        duration: 28,
        content: "Learn to combine multiple technical analysis tools into coherent trading strategies...",
        completed: false,
        order: 10
      },
      {
        id: "ta-lesson-11",
        title: "Backtesting Your Strategy",
        description: "Test strategies on historical data",
        type: "video",
        duration: 24,
        content: "Backtesting helps validate trading strategies before risking real money...",
        videoUrl: "https://example.com/backtesting.mp4",
        completed: false,
        order: 11
      },
      {
        id: "ta-lesson-12",
        title: "Final Assessment",
        description: "Comprehensive test of technical analysis skills",
        type: "quiz",
        duration: 15,
        content: "Final assessment covering all technical analysis concepts",
        quizQuestions: [
          {
            id: "ta-final-q1",
            question: "What is the most important aspect of trading?",
            options: ["Profit maximization", "Risk management", "Chart patterns", "Indicators"],
            correctAnswer: 1,
            explanation: "Risk management is crucial for long-term trading success."
          }
        ],
        completed: false,
        order: 12
      }
    ]
  },
  // Add more courses with similar structure...
  {
    id: "defi-fundamentals",
    title: "DeFi Fundamentals",
    description: "Understand decentralized finance protocols and yield farming",
    level: "Advanced",
    duration: "3 hours",
    students: 567,
    rating: 4.7,
    totalLessons: 10,
    icon: Target,
    color: "from-purple-500 to-violet-600",
    instructor: {
      name: "Alex Rodriguez",
      title: "DeFi Protocol Developer",
      avatar: "/api/placeholder/64/64",
      bio: "Core developer at major DeFi protocols with deep smart contract expertise"
    },
    objectives: [
      "Understand DeFi protocols and their mechanisms",
      "Learn about liquidity mining and yield farming",
      "Navigate DeFi platforms safely",
      "Identify opportunities and risks in DeFi"
    ],
    requirements: [
      "Solid understanding of cryptocurrency",
      "Experience with crypto wallets",
      "Basic knowledge of Ethereum"
    ],
    tags: ["defi", "yield farming", "liquidity", "protocols"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "defi-lesson-1",
        title: "Introduction to DeFi",
        description: "What is decentralized finance and why it matters",
        type: "video",
        duration: 18,
        content: "DeFi represents a paradigm shift from traditional finance to decentralized protocols...",
        videoUrl: "https://example.com/defi-intro.mp4",
        completed: false,
        order: 1
      },
      {
        id: "defi-lesson-2",
        title: "AMMs and Liquidity Pools",
        description: "Understanding automated market makers",
        type: "interactive",
        duration: 22,
        content: "Automated Market Makers revolutionize how trading works in DeFi...",
        completed: false,
        order: 2
      },
      // Add more DeFi lessons...
      {
        id: "defi-lesson-10",
        title: "DeFi Security and Risks",
        description: "Navigate DeFi safely and understand the risks",
        type: "text",
        duration: 20,
        content: "DeFi offers great opportunities but comes with unique risks that must be understood...",
        completed: false,
        order: 10
      }
    ]
  }
  // Add remaining courses (Risk Management, Security, Trading Psychology) with similar structure
];

// Mock user progress data
let userProgressData: { [userId: string]: UserProgress[] } = {};

class CourseService {
  // Get all courses
  getAllCourses(): Course[] {
    return mockCourses;
  }

  // Get course by ID
  getCourseById(courseId: string): Course | null {
    return mockCourses.find(course => course.id === courseId) || null;
  }

  // Get courses by level
  getCoursesByLevel(level: string): Course[] {
    return mockCourses.filter(course => course.level === level);
  }

  // Get user's enrolled courses
  getEnrolledCourses(userId: string): Course[] {
    const userProgress = this.getUserProgress(userId);
    const enrolledCourseIds = userProgress.map(p => p.courseId);
    return mockCourses.filter(course => enrolledCourseIds.includes(course.id));
  }

  // Enroll user in course
  enrollInCourse(userId: string, courseId: string): boolean {
    try {
      const course = this.getCourseById(courseId);
      if (!course) return false;

      // Initialize user progress if not exists
      if (!userProgressData[userId]) {
        userProgressData[userId] = [];
      }

      // Check if already enrolled
      const existingProgress = userProgressData[userId].find(p => p.courseId === courseId);
      if (existingProgress) return true;

      // Create new progress entry
      const newProgress: UserProgress = {
        courseId,
        completedLessons: [],
        progress: 0,
        lastAccessed: new Date(),
        timeSpent: 0,
        quizScores: {}
      };

      userProgressData[userId].push(newProgress);
      
      // Update course enrollment status
      course.enrolled = true;
      
      return true;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return false;
    }
  }

  // Mark lesson as completed
  markLessonCompleted(userId: string, courseId: string, lessonId: string): boolean {
    try {
      const userProgress = this.getUserProgressForCourse(userId, courseId);
      if (!userProgress) return false;

      // Add lesson to completed if not already there
      if (!userProgress.completedLessons.includes(lessonId)) {
        userProgress.completedLessons.push(lessonId);
      }

      // Update progress percentage
      const course = this.getCourseById(courseId);
      if (course) {
        userProgress.progress = (userProgress.completedLessons.length / course.totalLessons) * 100;
        course.progress = userProgress.progress;
        course.completedLessons = userProgress.completedLessons.length;
        
        // Mark lesson as completed in course data
        const lesson = course.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.completed = true;
        }
      }

      userProgress.lastAccessed = new Date();
      return true;
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      return false;
    }
  }

  // Get user progress for all courses
  getUserProgress(userId: string): UserProgress[] {
    return userProgressData[userId] || [];
  }

  // Get user progress for specific course
  getUserProgressForCourse(userId: string, courseId: string): UserProgress | null {
    const userProgress = this.getUserProgress(userId);
    return userProgress.find(p => p.courseId === courseId) || null;
  }

  // Save quiz score
  saveQuizScore(userId: string, courseId: string, lessonId: string, score: number): boolean {
    try {
      const userProgress = this.getUserProgressForCourse(userId, courseId);
      if (!userProgress) return false;

      userProgress.quizScores[lessonId] = score;
      userProgress.lastAccessed = new Date();
      
      // If quiz passed (score >= 70), mark lesson as completed
      if (score >= 70) {
        this.markLessonCompleted(userId, courseId, lessonId);
      }

      return true;
    } catch (error) {
      console.error('Error saving quiz score:', error);
      return false;
    }
  }

  // Update time spent on course
  updateTimeSpent(userId: string, courseId: string, additionalMinutes: number): void {
    const userProgress = this.getUserProgressForCourse(userId, courseId);
    if (userProgress) {
      userProgress.timeSpent += additionalMinutes;
      userProgress.lastAccessed = new Date();
    }
  }

  // Get course completion statistics
  getCourseStats(userId: string): {
    totalCourses: number;
    enrolledCourses: number;
    completedCourses: number;
    totalTimeSpent: number;
    averageProgress: number;
  } {
    const userProgress = this.getUserProgress(userId);
    const enrolledCourses = userProgress.length;
    const completedCourses = userProgress.filter(p => p.progress === 100).length;
    const totalTimeSpent = userProgress.reduce((total, p) => total + p.timeSpent, 0);
    const averageProgress = enrolledCourses > 0 
      ? userProgress.reduce((total, p) => total + p.progress, 0) / enrolledCourses 
      : 0;

    return {
      totalCourses: mockCourses.length,
      enrolledCourses,
      completedCourses,
      totalTimeSpent,
      averageProgress
    };
  }

  // Search courses
  searchCourses(query: string): Course[] {
    const lowercaseQuery = query.toLowerCase();
    return mockCourses.filter(course => 
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get recommended courses based on user's current courses
  getRecommendedCourses(userId: string): Course[] {
    const userProgress = this.getUserProgress(userId);
    const enrolledCourseIds = userProgress.map(p => p.courseId);
    
    // Simple recommendation: suggest courses not enrolled in
    return mockCourses.filter(course => !enrolledCourseIds.includes(course.id));
  }
}

export const courseService = new CourseService();
