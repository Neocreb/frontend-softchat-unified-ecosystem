import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Calendar,
  Sparkles,
  Flame,
  Clock,
  Trophy,
  Star,
  Zap,
  Crown,
  PartyPopper,
  Snowflake,
  Heart,
  Sun
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { rewardsNotificationService } from "@/services/rewardsNotificationService";

interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  theme: 'holiday' | 'anniversary' | 'seasonal' | 'special';
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'ending_soon' | 'ended';
  rewards: {
    type: 'multiplier' | 'bonus' | 'special';
    value: number;
    description: string;
  };
  progress?: {
    current: number;
    target: number;
    description: string;
  };
  icon: string;
  bgGradient: string;
  isParticipating: boolean;
}

interface BonusMultiplier {
  id: string;
  name: string;
  multiplier: number;
  duration: number; // minutes
  category: 'all' | 'battles' | 'content' | 'social';
  isActive: boolean;
  activatedAt?: Date;
}

interface SeasonalEventsProps {
  className?: string;
}

const SeasonalEvents = ({ className }: SeasonalEventsProps) => {
  const [currentEvents, setCurrentEvents] = useState<SeasonalEvent[]>([
    {
      id: "winter_bonus",
      title: "Winter Rewards Festival",
      description: "Double rewards on all activities! Plus special winter challenges with exclusive badges.",
      theme: "seasonal",
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: "active",
      rewards: {
        type: "multiplier",
        value: 2.0,
        description: "2x rewards on all activities"
      },
      progress: {
        current: 850,
        target: 1000,
        description: "Community participation points"
      },
      icon: "❄️",
      bgGradient: "from-blue-400 to-cyan-600",
      isParticipating: true
    },
    {
      id: "creator_appreciation",
      title: "Creator Appreciation Week",
      description: "Special bonuses for content creators and increased battle voting rewards.",
      theme: "special",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      status: "upcoming",
      rewards: {
        type: "bonus",
        value: 50,
        description: "50% bonus on content creation rewards"
      },
      icon: "🎨",
      bgGradient: "from-purple-400 to-pink-600",
      isParticipating: false
    },
    {
      id: "valentine_special",
      title: "Valentine's Day Special",
      description: "Spread love and earn special heart-themed rewards and exclusive Valentine badges.",
      theme: "holiday",
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-18'),
      status: "upcoming",
      rewards: {
        type: "special",
        value: 100,
        description: "Exclusive Valentine's Day rewards"
      },
      icon: "💖",
      bgGradient: "from-pink-400 to-red-500",
      isParticipating: false
    }
  ]);

  const [activeBonuses, setActiveBonuses] = useState<BonusMultiplier[]>([
    {
      id: "weekend_boost",
      name: "Weekend Boost",
      multiplier: 1.5,
      duration: 120, // 2 hours
      category: "all",
      isActive: true,
      activatedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: "battle_frenzy",
      name: "Battle Frenzy",
      multiplier: 2.0,
      duration: 60,
      category: "battles",
      isActive: false
    }
  ]);

  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: { [key: string]: number } = {};
      
      currentEvents.forEach(event => {
        if (event.status === 'active' || event.status === 'ending_soon') {
          const remaining = event.endDate.getTime() - Date.now();
          newTimeLeft[event.id] = Math.max(0, remaining);
        }
      });

      activeBonuses.forEach(bonus => {
        if (bonus.isActive && bonus.activatedAt) {
          const remaining = (bonus.activatedAt.getTime() + bonus.duration * 60 * 1000) - Date.now();
          newTimeLeft[bonus.id] = Math.max(0, remaining);
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEvents, activeBonuses]);

  const formatTimeRemaining = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'ending_soon': return 'bg-orange-500 animate-pulse';
      case 'upcoming': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'holiday': return <Heart className="h-5 w-5" />;
      case 'anniversary': return <PartyPopper className="h-5 w-5" />;
      case 'seasonal': return <Snowflake className="h-5 w-5" />;
      case 'special': return <Sparkles className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const activateBonus = (bonusId: string) => {
    setActiveBonuses(prev => prev.map(bonus => {
      if (bonus.id === bonusId) {
        // Trigger notification for bonus activation
        rewardsNotificationService.addRewardsNotification({
          type: 'bonus',
          title: 'Bonus Activated! ⚡',
          message: `${bonus.name} is now active - ${bonus.multiplier}x multiplier for ${bonus.duration} minutes`,
          priority: 'medium',
          actionUrl: '/app/rewards?tab=dashboard',
          actionLabel: 'View Dashboard'
        });
        return { ...bonus, isActive: true, activatedAt: new Date() };
      }
      return bonus;
    }));
  };

  const joinEvent = (eventId: string) => {
    setCurrentEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        // Trigger notification for event participation
        rewardsNotificationService.notifySeasonalEvent(
          event.title,
          event.rewards.description
        );
        return { ...event, isParticipating: true };
      }
      return event;
    }));
  };

  const activeEvents = currentEvents.filter(e => e.status === 'active' || e.status === 'ending_soon');
  const upcomingEvents = currentEvents.filter(e => e.status === 'upcoming');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Active Bonuses */}
      {activeBonuses.some(b => b.isActive) && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Zap className="h-5 w-5" />
              Active Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeBonuses.filter(b => b.isActive).map(bonus => (
                <div key={bonus.id} className="bg-white p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-yellow-800">{bonus.name}</h4>
                    <Badge className="bg-yellow-500 text-white">
                      {bonus.multiplier}x
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-600">
                      {bonus.category === 'all' ? 'All Activities' : bonus.category}
                    </span>
                    <span className="font-medium text-yellow-700">
                      {timeLeft[bonus.id] ? formatTimeRemaining(timeLeft[bonus.id]) : 'Expired'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Bonuses */}
      {activeBonuses.some(b => !b.isActive) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Bonus Multipliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBonuses.filter(b => !b.isActive).map(bonus => (
                <div key={bonus.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{bonus.name}</h4>
                    <Badge variant="outline">
                      {bonus.multiplier}x for {bonus.duration}min
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Boost your {bonus.category === 'all' ? 'all' : bonus.category} earnings
                  </p>
                  <Button 
                    onClick={() => activateBonus(bonus.id)}
                    size="sm" 
                    className="w-full"
                  >
                    Activate Bonus
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Active Events
          </h2>
          {activeEvents.map(event => (
            <Card key={event.id} className={`bg-gradient-to-r ${event.bgGradient} text-white overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{event.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-white/90 text-sm">{event.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={cn("mb-2", getStatusColor(event.status))}>
                      {event.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div className="text-white/90 text-sm">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {timeLeft[event.id] ? formatTimeRemaining(timeLeft[event.id]) : 'Ended'}
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold">Rewards:</span>
                  </div>
                  <p className="text-white/90">{event.rewards.description}</p>
                </div>

                {event.progress && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{event.progress.description}</span>
                      <span className="text-sm font-medium">
                        {formatNumber(event.progress.current)}/{formatNumber(event.progress.target)}
                      </span>
                    </div>
                    <Progress 
                      value={(event.progress.current / event.progress.target) * 100} 
                      className="h-2 bg-white/20"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getThemeIcon(event.theme)}
                    <span className="text-sm capitalize">{event.theme} Event</span>
                  </div>
                  {!event.isParticipating && (
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => joinEvent(event.id)}
                      className="bg-white text-gray-900 hover:bg-white/90"
                    >
                      Join Event
                    </Button>
                  )}
                  {event.isParticipating && (
                    <Badge className="bg-green-500">
                      <Star className="h-3 w-3 mr-1" />
                      Participating
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{event.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="text-sm">
                      <strong>Starts:</strong> {event.startDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <strong>Rewards:</strong> {event.rewards.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {event.theme} event
                    </Badge>
                    <Button size="sm" variant="outline">
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Event History/Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Event Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-muted-foreground">Events Participated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(1250)}</div>
              <div className="text-sm text-muted-foreground">Bonus Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <div className="text-sm text-muted-foreground">Special Badges Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalEvents;
