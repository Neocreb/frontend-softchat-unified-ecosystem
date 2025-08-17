import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useSocketEvent, useRealTimeWallet } from '../../hooks/use-realtime';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  DollarSign, 
  Users, 
  Gift,
  Crown,
  Star
} from 'lucide-react';

interface CreatorStats {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  totalEarnings: number;
  todayEarnings: number;
  monthlyEarnings: number;
  subscriberCount: number;
  engagement: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  topContent: {
    id: string;
    title: string;
    views: number;
    earnings: number;
    type: 'video' | 'post' | 'livestream';
  }[];
  recentTips: {
    id: string;
    amount: number;
    currency: string;
    sender: string;
    message?: string;
    timestamp: string;
  }[];
  milestones: {
    id: string;
    title: string;
    target: number;
    current: number;
    reward: number;
    completed: boolean;
  }[];
}

interface RealTimeCreatorDashboardProps {
  creatorId: string;
}

export function RealTimeCreatorDashboard({ creatorId }: RealTimeCreatorDashboardProps) {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [liveViewers, setLiveViewers] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { balance, recentTransactions } = useRealTimeWallet(creatorId);

  // Listen for real-time updates
  useSocketEvent('creator_stats_update', (data) => {
    if (data.creatorId === creatorId) {
      setStats(prev => prev ? { ...prev, ...data.stats } : data.stats);
    }
  }, [creatorId]);

  useSocketEvent('new_tip_received', (data) => {
    if (data.recipientId === creatorId) {
      setStats(prev => prev ? {
        ...prev,
        totalEarnings: prev.totalEarnings + data.amount,
        todayEarnings: prev.todayEarnings + data.amount,
        recentTips: [data.tip, ...prev.recentTips.slice(0, 9)]
      } : null);
      
      setRecentActivity(prev => [{
        id: `tip_${data.tip.id}`,
        type: 'tip',
        description: `Received ${formatCurrency(data.amount)} tip from ${data.tip.sender}`,
        timestamp: new Date(),
        amount: data.amount
      }, ...prev.slice(0, 19)]);
    }
  }, [creatorId]);

  useSocketEvent('new_subscriber', (data) => {
    if (data.creatorId === creatorId) {
      setStats(prev => prev ? {
        ...prev,
        subscriberCount: prev.subscriberCount + 1
      } : null);
      
      setRecentActivity(prev => [{
        id: `sub_${data.subscriber.id}`,
        type: 'subscriber',
        description: `${data.subscriber.name} subscribed to your channel`,
        timestamp: new Date()
      }, ...prev.slice(0, 19)]);
    }
  }, [creatorId]);

  useSocketEvent('content_engagement', (data) => {
    if (data.creatorId === creatorId) {
      const { type, contentId, contentTitle } = data;
      let description = '';
      
      switch (type) {
        case 'like':
          description = `Your ${data.contentType} "${contentTitle}" received a like`;
          setStats(prev => prev ? { ...prev, totalLikes: prev.totalLikes + 1 } : null);
          break;
        case 'share':
          description = `Your ${data.contentType} "${contentTitle}" was shared`;
          setStats(prev => prev ? { ...prev, totalShares: prev.totalShares + 1 } : null);
          break;
        case 'comment':
          description = `New comment on "${contentTitle}"`;
          setStats(prev => prev ? { ...prev, totalComments: prev.totalComments + 1 } : null);
          break;
        case 'view':
          setStats(prev => prev ? { ...prev, totalViews: prev.totalViews + 1 } : null);
          break;
      }
      
      if (description) {
        setRecentActivity(prev => [{
          id: `${type}_${contentId}_${Date.now()}`,
          type,
          description,
          timestamp: new Date()
        }, ...prev.slice(0, 19)]);
      }
    }
  }, [creatorId]);

  useSocketEvent('milestone_achieved', (data) => {
    if (data.creatorId === creatorId) {
      setStats(prev => prev ? {
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === data.milestone.id 
            ? { ...m, completed: true, current: data.milestone.target }
            : m
        )
      } : null);
      
      setRecentActivity(prev => [{
        id: `milestone_${data.milestone.id}`,
        type: 'milestone',
        description: `🎉 Milestone achieved: ${data.milestone.title}`,
        timestamp: new Date(),
        amount: data.milestone.reward
      }, ...prev.slice(0, 19)]);
    }
  }, [creatorId]);

  useSocketEvent('livestream_viewers', (data) => {
    if (data.creatorId === creatorId) {
      setLiveViewers(data.count);
      setIsLive(data.count > 0);
    }
  }, [creatorId]);

  // Fetch initial data
  useEffect(() => {
    const fetchCreatorStats = async () => {
      try {
        const response = await fetch(`/api/creator/stats/${creatorId}`);
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch creator stats:', error);
        setIsLoading(false);
      }
    };

    fetchCreatorStats();
  }, [creatorId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <p>Failed to load creator statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Status Banner */}
      {isLive && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-medium text-red-800">You're Live!</span>
              </div>
              <div className="flex items-center space-x-2 text-red-600">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{formatNumber(liveViewers)} viewers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Today: </span>
              <span className="ml-1 font-medium text-green-600">
                +{formatCurrency(stats.todayEarnings)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-bold">{formatNumber(stats.subscriberCount)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+2.5% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalViews)}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Engagement: </span>
              <span className="ml-1 font-medium">{stats.engagement.rate.toFixed(1)}%</span>
              {stats.engagement.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
              ) : stats.engagement.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {balance ? formatCurrency(balance.total) : '---'}
                </p>
              </div>
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Available for withdrawal
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topContent.map((content, index) => (
                <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{content.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(content.views)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {content.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(content.earnings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-pink-600" />
              Recent Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentTips.map((tip) => (
                <div key={tip.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium text-sm">{tip.sender}</p>
                    {tip.message && (
                      <p className="text-xs text-muted-foreground mt-1">"{tip.message}"</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(tip.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +{formatCurrency(tip.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {tip.currency}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentTips.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No tips received yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-600" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{milestone.title}</h4>
                  {milestone.completed && (
                    <Badge className="bg-green-100 text-green-800">
                      Completed!
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{formatNumber(milestone.current)} / {formatNumber(milestone.target)}</span>
                  </div>
                  <Progress 
                    value={(milestone.current / milestone.target) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Reward</span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(milestone.reward)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-2 border-b">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                {activity.amount && (
                  <div className="text-sm font-medium text-green-600">
                    +{formatCurrency(activity.amount)}
                  </div>
                )}
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
