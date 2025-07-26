import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Sparkles,
  Zap,
  Crown,
  Star,
  Trophy,
  Fire,
  Heart,
  Gift,
  Coins,
  Target,
  Award,
  Rocket,
  Flame,
  Gem,
  ThumbsUp,
  TrendingUp,
  Users,
  Eye,
  Share2,
  Volume2,
  VolumeX,
  MessageCircle,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Clock,
  Timer,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  Loader2,
  Maximize,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Download,
  Upload,
  Bell,
  Settings,
  Shield,
  Lock,
  Unlock,
  Bookmark,
  Flag,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animation Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    }
  },
  exit: { opacity: 0, scale: 0.3 },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

export const glowAnimation = {
  boxShadow: [
    "0 0 5px rgba(139, 92, 246, 0.3)",
    "0 0 20px rgba(139, 92, 246, 0.6)",
    "0 0 5px rgba(139, 92, 246, 0.3)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Floating Particles Animation
interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  color = "#8B5CF6",
  size = 4,
  speed = 20,
}) => {
  const particles = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute rounded-full opacity-60"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: speed,
            delay: Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Gift Animation Component
interface GiftAnimationProps {
  gift: {
    id: string;
    icon: string;
    name: string;
    color: string;
  };
  onAnimationComplete: () => void;
}

export const GiftAnimation: React.FC<GiftAnimationProps> = ({
  gift,
  onAnimationComplete,
}) => {
  return (
    <motion.div
      className="absolute left-1/2 bottom-20 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        y: [50, -20, -40, -80],
      }}
      transition={{
        duration: 3,
        ease: "easeOut",
        onComplete: onAnimationComplete,
      }}
    >
      <div 
        className="text-6xl drop-shadow-lg"
        style={{ filter: `drop-shadow(0 0 10px ${gift.color})` }}
      >
        {gift.icon}
      </div>
      <motion.div
        className="text-white text-sm font-bold text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {gift.name}
      </motion.div>
    </motion.div>
  );
};

// Combo Animation
interface ComboAnimationProps {
  comboCount: number;
  isActive: boolean;
}

export const ComboAnimation: React.FC<ComboAnimationProps> = ({
  comboCount,
  isActive,
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          variants={bounceIn}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="text-center">
            <motion.div
              className="text-6xl font-bold text-yellow-400 drop-shadow-lg"
              animate={pulseAnimation}
            >
              {comboCount}x
            </motion.div>
            <motion.div
              className="text-yellow-400 text-lg font-bold mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              COMBO!
            </motion.div>
            <motion.div
              className="flex justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Zap className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Score Update Animation
interface ScoreUpdateProps {
  points: number;
  color?: string;
  position?: { x: number; y: number };
}

export const ScoreUpdateAnimation: React.FC<ScoreUpdateProps> = ({
  points,
  color = "#10B981",
  position = { x: 50, y: 50 },
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.8],
        y: [0, -50, -80, -120],
      }}
      transition={{
        duration: 2,
        ease: "easeOut",
      }}
    >
      <div
        className="text-2xl font-bold drop-shadow-lg flex items-center gap-1"
        style={{ color }}
      >
        <Plus className="w-5 h-5" />
        {points.toLocaleString()}
      </div>
    </motion.div>
  );
};

// Tier Upgrade Animation
interface TierUpgradeAnimationProps {
  newTier: {
    name: string;
    icon: React.ReactNode;
    color: string;
  };
  onComplete: () => void;
}

export const TierUpgradeAnimation: React.FC<TierUpgradeAnimationProps> = ({
  newTier,
  onComplete,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{
            rotateY: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotateY: { duration: 2, ease: "easeInOut" },
            scale: { duration: 1, ease: "easeInOut" },
          }}
        >
          {newTier.icon}
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold text-white mb-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          TIER UPGRADE!
        </motion.h1>
        
        <motion.p
          className="text-2xl mb-8"
          style={{ color: newTier.color }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Welcome to {newTier.name}
        </motion.p>
        
        <motion.button
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold"
          onClick={onComplete}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      </motion.div>
      
      <FloatingParticles count={50} color={newTier.color} />
    </motion.div>
  );
};

// Battle Victory Animation
interface BattleVictoryAnimationProps {
  winner: {
    name: string;
    avatar: string;
    score: number;
  };
  onComplete: () => void;
}

export const BattleVictoryAnimation: React.FC<BattleVictoryAnimationProps> = ({
  winner,
  onComplete,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          🏆
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold text-yellow-400 mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          VICTORY!
        </motion.h1>
        
        <motion.div
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <img
            src={winner.avatar}
            alt={winner.name}
            className="w-16 h-16 rounded-full border-4 border-yellow-400"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{winner.name}</h2>
            <p className="text-yellow-400 text-xl">{winner.score.toLocaleString()} points</p>
          </div>
        </motion.div>
        
        <motion.button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold"
          onClick={onComplete}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Amazing!
        </motion.button>
      </div>
      
      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][i % 5],
              left: `${Math.random() * 100}%`,
              top: "-10px",
            }}
            animate={{
              y: [0, window.innerHeight + 50],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Live Viewer Counter Animation
interface LiveViewerCounterProps {
  count: number;
  isIncreasing: boolean;
}

export const LiveViewerCounter: React.FC<LiveViewerCounterProps> = ({
  count,
  isIncreasing,
}) => {
  const [displayCount, setDisplayCount] = useState(count);
  const controls = useAnimation();
  
  useEffect(() => {
    if (count !== displayCount) {
      controls.start({
        scale: [1, 1.2, 1],
        color: isIncreasing ? "#10B981" : "#EF4444",
        transition: { duration: 0.3 },
      });
      
      // Animate number counting
      const startCount = displayCount;
      const difference = count - startCount;
      const steps = 20;
      const stepValue = difference / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayCount(Math.round(startCount + (stepValue * currentStep)));
        } else {
          setDisplayCount(count);
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [count, displayCount, isIncreasing, controls]);
  
  return (
    <motion.div
      className="flex items-center gap-1 text-white"
      animate={controls}
    >
      <Eye className="w-4 h-4" />
      <span className="font-medium">{displayCount.toLocaleString()}</span>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isIncreasing ? 1 : 0,
          scale: isIncreasing ? 1 : 0,
        }}
        className="text-green-400"
      >
        <TrendingUp className="w-3 h-3" />
      </motion.div>
    </motion.div>
  );
};

// Tip Rain Animation
interface TipRainProps {
  tips: { id: string; amount: number; icon: string }[];
  isActive: boolean;
}

export const TipRainAnimation: React.FC<TipRainProps> = ({
  tips,
  isActive,
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              className="absolute text-2xl"
              style={{
                left: `${10 + (index * 15) % 80}%`,
                top: "-50px",
              }}
              initial={{ y: -50, opacity: 0, rotate: 0 }}
              animate={{
                y: [0, window.innerHeight + 100],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random(),
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <div className="flex flex-col items-center">
                <span>{tip.icon}</span>
                <span className="text-yellow-400 text-xs font-bold">
                  +{tip.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Achievement Unlock Animation
interface AchievementProps {
  achievement: {
    title: string;
    description: string;
    icon: React.ReactNode;
    rarity: "common" | "rare" | "epic" | "legendary";
  };
  onComplete: () => void;
}

export const AchievementUnlock: React.FC<AchievementProps> = ({
  achievement,
  onComplete,
}) => {
  const rarityColors = {
    common: "#6B7280",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };
  
  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="bg-gray-900 border-2 rounded-lg p-4 shadow-lg"
        style={{ borderColor: rarityColors[achievement.rarity] }}
        animate={glowAnimation}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {achievement.icon}
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold">{achievement.title}</h3>
              <span
                className="text-xs px-2 py-1 rounded-full font-bold uppercase"
                style={{ 
                  backgroundColor: `${rarityColors[achievement.rarity]}20`,
                  color: rarityColors[achievement.rarity],
                }}
              >
                {achievement.rarity}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{achievement.description}</p>
          </div>
          
          <button
            onClick={onComplete}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Animation for Video Processing
export const VideoProcessingLoader: React.FC<{ progress: number }> = ({
  progress,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative w-20 h-20 mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
        <motion.div
          className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent"
          style={{
            background: `conic-gradient(from 0deg, transparent, transparent ${progress * 3.6}deg, #8B5CF6 ${progress * 3.6}deg)`,
            borderRadius: "50%",
          }}
        />
        <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
      </motion.div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          Processing Video
        </h3>
        <p className="text-gray-400 text-sm mb-3">
          Creating your amazing content...
        </p>
        <div className="text-purple-400 font-bold">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

// Reaction Burst Animation
interface ReactionBurstProps {
  reactions: string[];
  position: { x: number; y: number };
  onComplete: () => void;
}

export const ReactionBurst: React.FC<ReactionBurstProps> = ({
  reactions,
  position,
  onComplete,
}) => {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: position.x, top: position.y }}
    >
      {reactions.map((reaction, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, -50 - Math.random() * 50],
            rotate: [0, (Math.random() - 0.5) * 360],
          }}
          transition={{
            duration: 1.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          onAnimationComplete={index === reactions.length - 1 ? onComplete : undefined}
        >
          {reaction}
        </motion.div>
      ))}
    </div>
  );
};

// Streak Counter Animation
interface StreakCounterProps {
  count: number;
  type: "win" | "tip" | "view";
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  count,
  type,
}) => {
  const getStreakIcon = () => {
    switch (type) {
      case "win": return <Trophy className="w-5 h-5" />;
      case "tip": return <Gift className="w-5 h-5" />;
      case "view": return <Eye className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };
  
  const getStreakColor = () => {
    if (count >= 10) return "text-yellow-400";
    if (count >= 5) return "text-orange-400";
    if (count >= 3) return "text-blue-400";
    return "text-gray-400";
  };
  
  return (
    <motion.div
      className={cn("flex items-center gap-1 px-2 py-1 rounded-full bg-black/40", getStreakColor())}
      animate={count >= 5 ? pulseAnimation : {}}
    >
      <Fire className="w-4 h-4" />
      <span className="text-sm font-bold">{count}</span>
      {getStreakIcon()}
    </motion.div>
  );
};

export default {
  FloatingParticles,
  GiftAnimation,
  ComboAnimation,
  ScoreUpdateAnimation,
  TierUpgradeAnimation,
  BattleVictoryAnimation,
  LiveViewerCounter,
  TipRainAnimation,
  AchievementUnlock,
  VideoProcessingLoader,
  ReactionBurst,
  StreakCounter,
  fadeInUp,
  scaleIn,
  slideInFromRight,
  bounceIn,
  pulseAnimation,
  shakeAnimation,
  glowAnimation,
};
