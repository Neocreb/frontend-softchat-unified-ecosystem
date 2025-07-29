import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import {
  Flame,
  Crown,
  Diamond,
  Star,
  Heart,
  Zap,
  Trophy,
  Gift,
  Sparkles,
  Coffee,
  Cake,
  Car,
  Plane,
  Home,
  Gem,
  Music,
  Camera,
  Gamepad2,
  Rocket,
  Target,
  Sword,
  Shield,
  Hammer,
  X,
  Coins,
} from 'lucide-react';

export interface BattleGift {
  id: string;
  name: string;
  emoji: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: number;
  multiplier: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'basic' | 'premium' | 'super' | 'ultimate';
  color: string;
  animation?: 'sparkle' | 'explosion' | 'rain' | 'lightning' | 'fire';
  description: string;
}

export const battleGifts: BattleGift[] = [
  // Basic Gifts
  { id: 'like', name: 'Like', emoji: '👍', icon: Heart, value: 1, multiplier: 10, rarity: 'common', category: 'basic', color: 'text-red-400', animation: 'sparkle', description: 'Show some love!' },
  { id: 'rose', name: 'Rose', emoji: '🌹', value: 5, multiplier: 50, rarity: 'common', category: 'basic', color: 'text-pink-400', animation: 'sparkle', description: 'A beautiful rose' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', icon: Coffee, value: 10, multiplier: 100, rarity: 'common', category: 'basic', color: 'text-amber-600', animation: 'sparkle', description: 'Fuel up!' },
  { id: 'cake', name: 'Cake', emoji: '🎂', icon: Cake, value: 20, multiplier: 200, rarity: 'common', category: 'basic', color: 'text-yellow-400', animation: 'sparkle', description: 'Sweet celebration' },
  
  // Premium Gifts
  { id: 'star', name: 'Star', emoji: '⭐', icon: Star, value: 50, multiplier: 500, rarity: 'rare', category: 'premium', color: 'text-yellow-300', animation: 'rain', description: 'You\'re a star!' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', icon: Diamond, value: 100, multiplier: 1000, rarity: 'rare', category: 'premium', color: 'text-blue-400', animation: 'sparkle', description: 'Precious gem' },
  { id: 'crown', name: 'Crown', emoji: '👑', icon: Crown, value: 200, multiplier: 2000, rarity: 'epic', category: 'premium', color: 'text-yellow-400', animation: 'lightning', description: 'Royal treatment' },
  { id: 'fire', name: 'Fire', emoji: '🔥', icon: Flame, value: 300, multiplier: 3000, rarity: 'epic', category: 'premium', color: 'text-orange-400', animation: 'fire', description: 'You\'re on fire!' },
  
  // Super Gifts
  { id: 'lightning', name: 'Lightning', emoji: '⚡', icon: Zap, value: 500, multiplier: 5000, rarity: 'epic', category: 'super', color: 'text-yellow-300', animation: 'lightning', description: 'Electric energy!' },
  { id: 'trophy', name: 'Trophy', emoji: '🏆', icon: Trophy, value: 750, multiplier: 7500, rarity: 'legendary', category: 'super', color: 'text-yellow-400', animation: 'explosion', description: 'Champion level!' },
  { id: 'sports_car', name: 'Sports Car', emoji: '🏎️', icon: Car, value: 1000, multiplier: 10000, rarity: 'legendary', category: 'super', color: 'text-red-500', animation: 'explosion', description: 'Luxury ride' },
  { id: 'private_jet', name: 'Private Jet', emoji: '✈️', icon: Plane, value: 2000, multiplier: 20000, rarity: 'legendary', category: 'super', color: 'text-blue-500', animation: 'explosion', description: 'Sky high support!' },
  
  // Ultimate Gifts
  { id: 'mansion', name: 'Mansion', emoji: '🏰', icon: Home, value: 5000, multiplier: 50000, rarity: 'mythic', category: 'ultimate', color: 'text-purple-500', animation: 'explosion', description: 'Ultimate luxury!' },
  { id: 'yacht', name: 'Yacht', emoji: '🛥️', value: 10000, multiplier: 100000, rarity: 'mythic', category: 'ultimate', color: 'text-cyan-400', animation: 'explosion', description: 'Sail away in style!' },
  
  // Battle Specific
  { id: 'sword', name: 'Battle Sword', emoji: '⚔️', icon: Sword, value: 250, multiplier: 2500, rarity: 'epic', category: 'premium', color: 'text-gray-300', animation: 'lightning', description: 'Ready for battle!' },
  { id: 'shield', name: 'Shield', emoji: '🛡️', icon: Shield, value: 300, multiplier: 3000, rarity: 'epic', category: 'premium', color: 'text-blue-600', animation: 'sparkle', description: 'Defend your champion!' },
  { id: 'hammer', name: 'Stun Hammer', emoji: '🔨', icon: Hammer, value: 400, multiplier: 4000, rarity: 'legendary', category: 'super', color: 'text-orange-600', animation: 'lightning', description: 'Stunning blow!' },
];

interface EnhancedBattleGiftsProps {
  onSendGift: (gift: BattleGift, recipient: 'creator1' | 'creator2') => void;
  selectedCreator: 'creator1' | 'creator2';
  onCreatorSelect: (creator: 'creator1' | 'creator2') => void;
  creator1Name: string;
  creator2Name: string;
  userBalance?: number;
  onClose: () => void;
}

export const EnhancedBattleGifts: React.FC<EnhancedBattleGiftsProps> = ({
  onSendGift,
  selectedCreator,
  onCreatorSelect,
  creator1Name,
  creator2Name,
  userBalance = 10000,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'premium' | 'super' | 'ultimate'>('basic');
  const [selectedGift, setSelectedGift] = useState<BattleGift | null>(null);

  const categories = [
    { id: 'basic', name: 'Basic', icon: Heart, color: 'text-green-400' },
    { id: 'premium', name: 'Premium', icon: Star, color: 'text-blue-400' },
    { id: 'super', name: 'Super', icon: Flame, color: 'text-purple-400' },
    { id: 'ultimate', name: 'Ultimate', icon: Crown, color: 'text-yellow-400' },
  ] as const;

  const filteredGifts = battleGifts.filter(gift => gift.category === selectedCategory);

  const getRarityColor = (rarity: BattleGift['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10';
      case 'rare': return 'border-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10';
      case 'mythic': return 'border-pink-400 bg-pink-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const canAfford = (gift: BattleGift) => userBalance >= gift.value;

  return (
    <div className="bg-black/95 rounded-2xl p-4 backdrop-blur-md border border-white/20 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-400" />
          <h3 className="text-white font-semibold">Battle Gifts</h3>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
            {userBalance.toLocaleString()} coins
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Creator Selection */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => onCreatorSelect('creator1')}
          variant={selectedCreator === 'creator1' ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-1 text-xs",
            selectedCreator === 'creator1' 
              ? "bg-blue-500 hover:bg-blue-600 text-white" 
              : "border-blue-400 text-blue-400 hover:bg-blue-400/20"
          )}
        >
          👑 {creator1Name}
        </Button>
        <Button
          onClick={() => onCreatorSelect('creator2')}
          variant={selectedCreator === 'creator2' ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-1 text-xs",
            selectedCreator === 'creator2' 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "border-red-400 text-red-400 hover:bg-red-400/20"
          )}
        >
          ⚔️ {creator2Name}
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-4 bg-white/10 rounded-lg p-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1 text-xs h-8",
                selectedCategory === category.id
                  ? "bg-white text-black hover:bg-white/90"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-3 h-3 mr-1" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {filteredGifts.map((gift) => {
          const Icon = gift.icon;
          const affordable = canAfford(gift);
          
          return (
            <Button
              key={gift.id}
              variant="ghost"
              onClick={() => {
                if (affordable) {
                  setSelectedGift(gift);
                  onSendGift(gift, selectedCreator);
                }
              }}
              disabled={!affordable}
              className={cn(
                "flex flex-col items-center gap-1 p-3 h-auto rounded-lg border transition-all duration-200",
                getRarityColor(gift.rarity),
                affordable 
                  ? "hover:scale-105 hover:bg-white/20 text-white" 
                  : "opacity-50 cursor-not-allowed text-white/50",
                selectedGift?.id === gift.id && "ring-2 ring-white/50"
              )}
            >
              <div className="text-2xl mb-1">{gift.emoji}</div>
              {Icon && <Icon className={cn("w-3 h-3", gift.color)} />}
              <span className="text-xs font-medium text-center leading-tight">{gift.name}</span>
              <div className="flex items-center gap-1">
                <span className={cn("text-xs font-bold", gift.color)}>
                  {gift.value}
                </span>
                <Coins className="w-3 h-3 text-yellow-400" />
              </div>
              <Badge variant="secondary" className={cn(
                "text-xs px-1 py-0",
                gift.rarity === 'common' && "bg-gray-500/20 text-gray-300",
                gift.rarity === 'rare' && "bg-blue-500/20 text-blue-300",
                gift.rarity === 'epic' && "bg-purple-500/20 text-purple-300",
                gift.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-300",
                gift.rarity === 'mythic' && "bg-pink-500/20 text-pink-300"
              )}>
                {gift.rarity}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Selected Gift Preview */}
      {selectedGift && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedGift.emoji}</div>
            <div className="flex-1">
              <div className="text-white font-medium">{selectedGift.name}</div>
              <div className="text-white/70 text-sm">{selectedGift.description}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-sm font-bold", selectedGift.color)}>
                  {selectedGift.value} coins
                </span>
                <span className="text-green-400 text-sm">
                  +{selectedGift.multiplier} battle points
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
        >
          💰 Get Coins
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
        >
          🎁 Gift History
        </Button>
      </div>
    </div>
  );
};

export default EnhancedBattleGifts;
