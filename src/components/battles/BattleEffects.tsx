import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import {
  Sparkles,
  Zap,
  Flame,
  Crown,
  Diamond,
  Star,
  Heart,
  Trophy,
  Target,
  Bomb,
} from 'lucide-react';

interface BattleEffect {
  id: string;
  type: 'gift' | 'score' | 'victory' | 'stun' | 'combo';
  animation: 'sparkle' | 'explosion' | 'rain' | 'lightning' | 'fire' | 'float' | 'shake';
  position: { x: number; y: number };
  value?: number;
  gift?: {
    emoji: string;
    name: string;
    rarity: string;
  };
  duration: number;
  timestamp: number;
}

interface BattleEffectsProps {
  effects: BattleEffect[];
  onEffectComplete: (effectId: string) => void;
  className?: string;
}

export const BattleEffects: React.FC<BattleEffectsProps> = ({
  effects,
  onEffectComplete,
  className,
}) => {
  const [activeEffects, setActiveEffects] = useState<BattleEffect[]>([]);

  useEffect(() => {
    setActiveEffects(effects);

    // Auto-remove effects after their duration
    effects.forEach((effect) => {
      setTimeout(() => {
        onEffectComplete(effect.id);
      }, effect.duration);
    });
  }, [effects, onEffectComplete]);

  const getAnimationClass = (animation: BattleEffect['animation']) => {
    switch (animation) {
      case 'sparkle':
        return 'animate-ping';
      case 'explosion':
        return 'animate-bounce';
      case 'rain':
        return 'animate-pulse';
      case 'lightning':
        return 'animate-pulse animate-ping';
      case 'fire':
        return 'animate-bounce animate-pulse';
      case 'float':
        return 'animate-bounce';
      case 'shake':
        return 'animate-pulse';
      default:
        return 'animate-pulse';
    }
  };

  const getEffectIcon = (effect: BattleEffect) => {
    switch (effect.type) {
      case 'gift':
        switch (effect.animation) {
          case 'sparkle':
            return <Sparkles className="w-8 h-8 text-yellow-400" />;
          case 'lightning':
            return <Zap className="w-8 h-8 text-blue-400" />;
          case 'fire':
            return <Flame className="w-8 h-8 text-orange-400" />;
          case 'explosion':
            return <Bomb className="w-8 h-8 text-red-400" />;
          default:
            return <Star className="w-8 h-8 text-purple-400" />;
        }
      case 'score':
        return <Target className="w-6 h-6 text-green-400" />;
      case 'victory':
        return <Trophy className="w-10 h-10 text-yellow-400" />;
      case 'stun':
        return <Zap className="w-8 h-8 text-yellow-300" />;
      case 'combo':
        return <Crown className="w-8 h-8 text-purple-400" />;
      default:
        return <Heart className="w-6 h-6 text-pink-400" />;
    }
  };

  const getRarityGlow = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return 'drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]';
      case 'epic':
        return 'drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]';
      case 'rare':
        return 'drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]';
      case 'mythic':
        return 'drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]';
      default:
        return 'drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]';
    }
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none z-40", className)}>
      {activeEffects.map((effect) => (
        <div
          key={effect.id}
          className={cn(
            "absolute transition-all duration-1000",
            getAnimationClass(effect.animation)
          )}
          style={{
            left: `${effect.position.x}%`,
            top: `${effect.position.y}%`,
            animation: `float-away-${effect.animation} ${effect.duration}ms ease-out forwards`,
          }}
        >
          {/* Gift Animation */}
          {effect.type === 'gift' && effect.gift && (
            <div className="flex flex-col items-center">
              <div className={cn(
                "text-6xl mb-2 animate-bounce",
                getRarityGlow(effect.gift.rarity)
              )}>
                {effect.gift.emoji}
              </div>
              <div className="bg-black/80 rounded-lg px-3 py-1 backdrop-blur-sm">
                <div className="text-white text-sm font-bold text-center">
                  {effect.gift.name}
                </div>
                {effect.value && (
                  <div className="text-yellow-400 text-xs text-center">
                    +{effect.value.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Score Effect */}
          {effect.type === 'score' && (
            <div className="flex items-center gap-2 bg-green-500/20 rounded-lg px-3 py-2 backdrop-blur-sm border border-green-400">
              {getEffectIcon(effect)}
              <span className="text-green-400 font-bold text-lg">
                +{effect.value?.toLocaleString()}
              </span>
            </div>
          )}

          {/* Victory Effect */}
          {effect.type === 'victory' && (
            <div className="flex flex-col items-center">
              <div className="text-8xl mb-2 animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,1)]">
                🏆
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg px-4 py-2 backdrop-blur-sm">
                <div className="text-black text-xl font-bold text-center">
                  VICTORY!
                </div>
              </div>
            </div>
          )}

          {/* Stun Effect */}
          {effect.type === 'stun' && (
            <div className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 backdrop-blur-sm border border-yellow-400">
              <div className="text-4xl animate-spin">💫</div>
              <span className="text-yellow-400 font-bold text-lg">
                STUNNED!
              </span>
            </div>
          )}

          {/* Combo Effect */}
          {effect.type === 'combo' && (
            <div className="flex items-center gap-2 bg-purple-500/20 rounded-lg px-3 py-2 backdrop-blur-sm border border-purple-400">
              <div className="text-3xl">🔥</div>
              <span className="text-purple-400 font-bold text-lg">
                COMBO x{effect.value}!
              </span>
            </div>
          )}

          {/* General Effect Icon */}
          {!['gift', 'score', 'victory', 'stun', 'combo'].includes(effect.type) && (
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              {getEffectIcon(effect)}
            </div>
          )}
        </div>
      ))}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-away-sparkle {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.2);
          }
        }

        @keyframes float-away-explosion {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        @keyframes float-away-rain {
          0% {
            opacity: 1;
            transform: translateY(-20px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(100px) scale(1.2);
          }
        }

        @keyframes float-away-lightning {
          0% {
            opacity: 1;
            transform: translateX(0) scale(0.5);
          }
          25% {
            transform: translateX(-10px) scale(1);
          }
          75% {
            transform: translateX(10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(0) scale(1.5);
          }
        }

        @keyframes float-away-fire {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.5);
          }
        }

        @keyframes float-away-float {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.1);
          }
        }

        @keyframes float-away-shake {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
          100% {
            opacity: 0;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BattleEffects;
