import { Course, Lesson } from "./courseService";
import { Shield, Brain } from "lucide-react";

// Extended course data for remaining courses
export const extendedCourseData: Partial<Course>[] = [
  {
    id: "risk-management",
    title: "Risk Management",
    description: "Learn how to protect your investments and minimize losses",
    level: "Intermediate",
    duration: "2.5 hours",
    students: 750,
    rating: 4.8,
    totalLessons: 9,
    icon: Shield,
    color: "from-orange-500 to-red-600",
    instructor: {
      name: "Jennifer Davis",
      title: "Risk Management Specialist",
      avatar: "/api/placeholder/64/64",
      bio: "Former hedge fund risk manager with 12+ years experience in portfolio risk assessment"
    },
    objectives: [
      "Understand different types of investment risks",
      "Learn position sizing and portfolio allocation",
      "Implement stop-loss and take-profit strategies",
      "Develop emotional discipline in trading"
    ],
    requirements: [
      "Basic trading knowledge",
      "Understanding of market dynamics",
      "Capital to practice with"
    ],
    tags: ["risk management", "trading", "portfolio", "strategy"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "risk-lesson-1",
        title: "Understanding Investment Risk",
        description: "Learn about different types of risks in cryptocurrency investing",
        type: "video",
        duration: 16,
        content: "Investment risk comes in many forms in the cryptocurrency market...",
        videoUrl: "https://example.com/risk-types.mp4",
        completed: false,
        order: 1
      },
      {
        id: "risk-lesson-2",
        title: "Position Sizing Fundamentals",
        description: "Learn how to size your positions properly to manage risk",
        type: "interactive",
        duration: 20,
        content: "Position sizing is one of the most important aspects of risk management...",
        completed: false,
        order: 2
      },
      {
        id: "risk-lesson-3",
        title: "Stop Loss Strategies",
        description: "Master different stop loss techniques",
        type: "video",
        duration: 18,
        content: "Stop losses are essential tools for limiting downside risk...",
        videoUrl: "https://example.com/stop-loss.mp4",
        completed: false,
        order: 3
      },
      {
        id: "risk-lesson-4",
        title: "Portfolio Diversification",
        description: "Learn how to diversify your crypto portfolio effectively",
        type: "text",
        duration: 14,
        content: "Diversification helps reduce the impact of any single asset's poor performance...",
        completed: false,
        order: 4
      },
      {
        id: "risk-lesson-5",
        title: "Risk Assessment Quiz",
        description: "Test your understanding of risk management principles",
        type: "quiz",
        duration: 12,
        content: "Assessment covering risk management fundamentals",
        quizQuestions: [
          {
            id: "risk-q1",
            question: "What is the primary purpose of position sizing?",
            options: ["Maximize profits", "Control risk exposure", "Increase trading frequency", "Follow market trends"],
            correctAnswer: 1,
            explanation: "Position sizing is primarily used to control risk exposure and preserve capital."
          },
          {
            id: "risk-q2",
            question: "When should you use a stop loss?",
            options: ["Only when losing money", "On every trade", "Only on large positions", "Never"],
            correctAnswer: 1,
            explanation: "Stop losses should be used on every trade to limit potential losses."
          }
        ],
        completed: false,
        order: 5
      },
      {
        id: "risk-lesson-6",
        title: "Emotional Risk Management",
        description: "Control emotions to make better trading decisions",
        type: "video",
        duration: 22,
        content: "Emotional control is crucial for consistent trading performance...",
        videoUrl: "https://example.com/emotional-risk.mp4",
        completed: false,
        order: 6
      },
      {
        id: "risk-lesson-7",
        title: "Risk-Reward Ratios",
        description: "Understanding and implementing proper risk-reward ratios",
        type: "interactive",
        duration: 17,
        content: "Risk-reward ratios help ensure your winning trades outweigh your losses...",
        completed: false,
        order: 7
      },
      {
        id: "risk-lesson-8",
        title: "Portfolio Management Tools",
        description: "Learn about tools and techniques for portfolio management",
        type: "text",
        duration: 15,
        content: "Various tools can help you track and manage portfolio risk effectively...",
        completed: false,
        order: 8
      },
      {
        id: "risk-lesson-9",
        title: "Final Risk Management Assessment",
        description: "Comprehensive test of risk management skills",
        type: "quiz",
        duration: 18,
        content: "Final assessment covering all risk management concepts",
        quizQuestions: [
          {
            id: "risk-final-q1",
            question: "What is the most important aspect of risk management?",
            options: ["Making profits", "Preserving capital", "Technical analysis", "Market timing"],
            correctAnswer: 1,
            explanation: "Preserving capital is the foundation of successful long-term investing."
          }
        ],
        completed: false,
        order: 9
      }
    ]
  },
  {
    id: "crypto-security",
    title: "Crypto Security Best Practices",
    description: "Secure your digital assets with proper wallet and key management",
    level: "Beginner",
    duration: "1.5 hours",
    students: 980,
    rating: 4.9,
    totalLessons: 6,
    icon: Shield,
    color: "from-red-500 to-pink-600",
    instructor: {
      name: "David Kim",
      title: "Cybersecurity Expert",
      avatar: "/api/placeholder/64/64",
      bio: "Cybersecurity specialist focused on blockchain and cryptocurrency security"
    },
    objectives: [
      "Understand cryptocurrency security fundamentals",
      "Learn proper wallet security practices",
      "Implement multi-factor authentication",
      "Recognize and avoid common scams"
    ],
    requirements: [
      "Basic computer skills",
      "Understanding of cryptocurrency basics",
      "Access to smartphone for 2FA"
    ],
    tags: ["security", "wallets", "safety", "best practices"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "security-lesson-1",
        title: "Cryptocurrency Security Fundamentals",
        description: "Learn the basics of keeping your crypto safe",
        type: "video",
        duration: 14,
        content: "Security is paramount in the cryptocurrency world...",
        videoUrl: "https://example.com/security-fundamentals.mp4",
        completed: false,
        order: 1
      },
      {
        id: "security-lesson-2",
        title: "Wallet Types and Security",
        description: "Understanding different wallet types and their security features",
        type: "interactive",
        duration: 16,
        content: "Different wallet types offer varying levels of security...",
        completed: false,
        order: 2
      },
      {
        id: "security-lesson-3",
        title: "Private Key Management",
        description: "Best practices for storing and managing private keys",
        type: "text",
        duration: 12,
        content: "Your private keys are the most important aspect of crypto security...",
        completed: false,
        order: 3
      },
      {
        id: "security-lesson-4",
        title: "Two-Factor Authentication Setup",
        description: "Setting up and using 2FA for enhanced security",
        type: "video",
        duration: 10,
        content: "Two-factor authentication adds an extra layer of security...",
        videoUrl: "https://example.com/2fa-setup.mp4",
        completed: false,
        order: 4
      },
      {
        id: "security-lesson-5",
        title: "Recognizing Crypto Scams",
        description: "Learn to identify and avoid common cryptocurrency scams",
        type: "interactive",
        duration: 18,
        content: "Scammers use various tactics to steal cryptocurrency...",
        completed: false,
        order: 5
      },
      {
        id: "security-lesson-6",
        title: "Security Best Practices Quiz",
        description: "Test your knowledge of cryptocurrency security",
        type: "quiz",
        duration: 15,
        content: "Final assessment of security knowledge",
        quizQuestions: [
          {
            id: "security-q1",
            question: "What is the most secure way to store large amounts of cryptocurrency?",
            options: ["Exchange wallet", "Mobile wallet", "Hardware wallet", "Web wallet"],
            correctAnswer: 2,
            explanation: "Hardware wallets provide the highest level of security for storing cryptocurrency."
          },
          {
            id: "security-q2",
            question: "Should you share your private keys?",
            options: ["With trusted friends", "With exchanges", "Never", "With family"],
            correctAnswer: 2,
            explanation: "Private keys should never be shared with anyone under any circumstances."
          }
        ],
        completed: false,
        order: 6
      }
    ]
  },
  {
    id: "trading-psychology",
    title: "Advanced Trading Psychology",
    description: "Master the mental aspects of trading and emotional control",
    level: "Advanced",
    duration: "3.5 hours",
    students: 445,
    rating: 4.6,
    totalLessons: 11,
    icon: Brain,
    color: "from-indigo-500 to-purple-600",
    instructor: {
      name: "Dr. Maria Rodriguez",
      title: "Trading Psychologist",
      avatar: "/api/placeholder/64/64",
      bio: "PhD in Psychology specializing in trader behavior and market psychology"
    },
    objectives: [
      "Understand the psychology behind trading decisions",
      "Develop emotional discipline and control",
      "Learn to manage fear and greed",
      "Build consistent trading habits"
    ],
    requirements: [
      "Trading experience",
      "Understanding of technical analysis",
      "Commitment to self-improvement"
    ],
    tags: ["psychology", "emotions", "discipline", "mindset"],
    enrolled: false,
    progress: 0,
    completedLessons: 0,
    certificate: true,
    lessons: [
      {
        id: "psych-lesson-1",
        title: "The Psychology of Trading",
        description: "Understanding how psychology affects trading performance",
        type: "video",
        duration: 20,
        content: "Trading success is 80% psychology and 20% strategy...",
        videoUrl: "https://example.com/trading-psychology.mp4",
        completed: false,
        order: 1
      },
      {
        id: "psych-lesson-2",
        title: "Fear and Greed in Markets",
        description: "Managing the two primary emotions that drive markets",
        type: "interactive",
        duration: 18,
        content: "Fear and greed are the primary drivers of market movements...",
        completed: false,
        order: 2
      },
      {
        id: "psych-lesson-3",
        title: "Cognitive Biases in Trading",
        description: "Recognizing and overcoming common cognitive biases",
        type: "text",
        duration: 16,
        content: "Cognitive biases can severely impact trading performance...",
        completed: false,
        order: 3
      },
      {
        id: "psych-lesson-4",
        title: "Developing Trading Discipline",
        description: "Building habits for consistent trading success",
        type: "video",
        duration: 22,
        content: "Discipline is the foundation of profitable trading...",
        videoUrl: "https://example.com/trading-discipline.mp4",
        completed: false,
        order: 4
      },
      {
        id: "psych-lesson-5",
        title: "Psychology Assessment",
        description: "Evaluate your trading psychology strengths and weaknesses",
        type: "quiz",
        duration: 15,
        content: "Assessment of trading psychology concepts",
        quizQuestions: [
          {
            id: "psych-q1",
            question: "What is the biggest enemy of successful trading?",
            options: ["Market volatility", "Emotions", "Technical indicators", "News events"],
            correctAnswer: 1,
            explanation: "Emotions are the biggest enemy of successful trading as they lead to poor decision-making."
          }
        ],
        completed: false,
        order: 5
      },
      {
        id: "psych-lesson-6",
        title: "Stress Management for Traders",
        description: "Techniques for managing trading-related stress",
        type: "interactive",
        duration: 19,
        content: "Trading can be highly stressful; learning to manage stress is crucial...",
        completed: false,
        order: 6
      },
      {
        id: "psych-lesson-7",
        title: "Building Mental Resilience",
        description: "Develop the mental toughness needed for trading",
        type: "video",
        duration: 17,
        content: "Mental resilience helps traders bounce back from losses...",
        videoUrl: "https://example.com/mental-resilience.mp4",
        completed: false,
        order: 7
      },
      {
        id: "psych-lesson-8",
        title: "Trading Journal and Self-Analysis",
        description: "Using journaling for psychological improvement",
        type: "text",
        duration: 14,
        content: "A trading journal is essential for psychological development...",
        completed: false,
        order: 8
      },
      {
        id: "psych-lesson-9",
        title: "Meditation and Mindfulness",
        description: "Incorporating mindfulness practices into trading",
        type: "interactive",
        duration: 21,
        content: "Mindfulness can significantly improve trading performance...",
        completed: false,
        order: 9
      },
      {
        id: "psych-lesson-10",
        title: "Goal Setting and Motivation",
        description: "Setting realistic goals and maintaining motivation",
        type: "video",
        duration: 18,
        content: "Proper goal setting keeps traders motivated and focused...",
        videoUrl: "https://example.com/goal-setting.mp4",
        completed: false,
        order: 10
      },
      {
        id: "psych-lesson-11",
        title: "Advanced Psychology Assessment",
        description: "Comprehensive evaluation of trading psychology mastery",
        type: "quiz",
        duration: 20,
        content: "Final comprehensive assessment",
        quizQuestions: [
          {
            id: "psych-final-q1",
            question: "What is the key to long-term trading success?",
            options: ["Perfect strategy", "Emotional control", "Market prediction", "High leverage"],
            correctAnswer: 1,
            explanation: "Emotional control and psychological discipline are the keys to long-term trading success."
          }
        ],
        completed: false,
        order: 11
      }
    ]
  }
];

// Function to merge extended data with existing courses
export function getCompleteCoursesWithExtendedData(existingCourses: Course[]): Course[] {
  return existingCourses.map(course => {
    const extension = extendedCourseData.find(ext => ext.id === course.id);
    if (extension && extension.lessons) {
      return {
        ...course,
        ...extension,
        lessons: extension.lessons as Lesson[]
      } as Course;
    }
    return course;
  });
}
