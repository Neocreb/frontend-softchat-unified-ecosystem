import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Star, 
  Trophy, 
  Coins, 
  CheckCircle2, 
  Zap,
  Award,
  BookOpen,
  Target,
  Heart
} from 'lucide-react';

export interface RewardNotificationData {
  id: string;
  type: 'points' | 'achievement' | 'milestone' | 'streak' | 'completion';
  title: string;
  description: string;
  points?: number;
  icon?: 'gift' | 'star' | 'trophy' | 'coins' | 'check' | 'zap' | 'award' | 'book' | 'target' | 'heart';
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'pink';
  duration?: number; // milliseconds
}

interface RewardNotificationProps {
  notification: RewardNotificationData;
  onComplete: (id: string) => void;
}

const iconMap = {
  gift: Gift,
  star: Star,
  trophy: Trophy,
  coins: Coins,
  check: CheckCircle2,
  zap: Zap,
  award: Award,
  book: BookOpen,
  target: Target,
  heart: Heart
};

const colorMap = {
  blue: 'from-blue-500 to-cyan-600',
  green: 'from-green-500 to-emerald-600',
  purple: 'from-purple-500 to-violet-600',
  amber: 'from-amber-500 to-orange-600',
  red: 'from-red-500 to-pink-600',
  pink: 'from-pink-500 to-rose-600'
};

const getTypeConfig = (type: RewardNotificationData['type']) => {
  switch (type) {
    case 'points':
      return { icon: 'coins', color: 'amber' };
    case 'achievement':
      return { icon: 'trophy', color: 'purple' };
    case 'milestone':
      return { icon: 'award', color: 'blue' };
    case 'streak':
      return { icon: 'zap', color: 'green' };
    case 'completion':
      return { icon: 'check', color: 'green' };
    default:
      return { icon: 'gift', color: 'blue' };
  }
};

export const RewardNotification: React.FC<RewardNotificationProps> = ({
  notification,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const typeConfig = getTypeConfig(notification.type);
  const IconComponent = iconMap[notification.icon || typeConfig.icon as keyof typeof iconMap];
  const colorClass = colorMap[notification.color || typeConfig.color as keyof typeof colorMap];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(notification.id), 300);
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="fixed top-4 right-4 z-[9999] max-w-sm"
          onClick={() => setIsVisible(false)}
        >
          <Card className={`cursor-pointer shadow-lg border-l-4 bg-gradient-to-r ${colorClass} bg-opacity-10 backdrop-blur-sm`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <motion.div 
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-md`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {notification.title}
                    </h4>
                    {notification.points && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                      >
                        <Badge className={`bg-gradient-to-r ${colorClass} text-white text-xs`}>
                          +{notification.points} pts
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                </div>
              </div>
              
              {/* Progress bar animation */}
              <motion.div 
                className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ 
                    duration: (notification.duration || 4000) / 1000,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing multiple reward notifications
export const useRewardNotifications = () => {
  const [notifications, setNotifications] = useState<RewardNotificationData[]>([]);

  const showNotification = (notification: Omit<RewardNotificationData, 'id'>) => {
    const id = `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: RewardNotificationData = {
      ...notification,
      id
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auto-setup event listener for reward events
  useEffect(() => {
    const handleRewardEarned = (event: CustomEvent) => {
      const { reward, action, description } = event.detail;
      
      showNotification({
        type: 'points',
        title: 'Reward Earned!',
        description: description || `You earned ${reward} points for ${action}`,
        points: reward,
        duration: 5000
      });
    };

    window.addEventListener('rewardEarned', handleRewardEarned as EventListener);
    
    return () => {
      window.removeEventListener('rewardEarned', handleRewardEarned as EventListener);
    };
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification
  };
};

// Component to render all notifications
export const RewardNotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useRewardNotifications();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <RewardNotification
            notification={notification}
            onComplete={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};

// Utility functions for creating specific notification types
export const createRewardNotifications = {
  lessonCompleted: (lessonTitle: string, points: number) => ({
    type: 'completion' as const,
    title: 'Lesson Completed!',
    description: `Great job completing "${lessonTitle}"`,
    points,
    icon: 'check' as const,
    color: 'green' as const
  }),

  quizPassed: (quizTitle: string, score: number, points: number) => ({
    type: 'achievement' as const,
    title: 'Quiz Passed!',
    description: `You scored ${score}% on "${quizTitle}"`,
    points,
    icon: 'trophy' as const,
    color: 'purple' as const
  }),

  perfectScore: (quizTitle: string, bonusPoints: number) => ({
    type: 'achievement' as const,
    title: 'Perfect Score!',
    description: `100% on "${quizTitle}" - Amazing work!`,
    points: bonusPoints,
    icon: 'star' as const,
    color: 'amber' as const
  }),

  courseCompleted: (courseTitle: string, points: number) => ({
    type: 'milestone' as const,
    title: 'Course Completed!',
    description: `Congratulations on completing "${courseTitle}"`,
    points,
    icon: 'award' as const,
    color: 'blue' as const
  }),

  certificateEarned: (courseTitle: string, points: number) => ({
    type: 'achievement' as const,
    title: 'Certificate Earned!',
    description: `You've earned a certificate for "${courseTitle}"`,
    points,
    icon: 'award' as const,
    color: 'purple' as const
  }),

  streakAchieved: (days: number, points: number) => ({
    type: 'streak' as const,
    title: 'Learning Streak!',
    description: `${days} days of continuous learning`,
    points,
    icon: 'zap' as const,
    color: 'green' as const
  }),

  engagementReward: (action: string, points: number) => ({
    type: 'points' as const,
    title: 'Engagement Reward',
    description: `Thanks for ${action}!`,
    points,
    icon: 'heart' as const,
    color: 'pink' as const
  })
};

export default RewardNotification;
