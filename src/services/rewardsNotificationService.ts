interface RewardsNotificationData {
  type: 'earning' | 'achievement' | 'battle' | 'challenge' | 'goal' | 'bonus' | 'gift';
  title: string;
  message: string;
  amount?: number;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

class RewardsNotificationService {
  // Add notification to the main platform notification system
  addRewardsNotification(data: RewardsNotificationData) {
    // Create notification object compatible with main notification system
    const notification = {
      id: Date.now().toString(),
      type: 'rewards' as const,
      title: data.title,
      message: data.message,
      timestamp: new Date(),
      read: false,
      priority: data.priority,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      data: {
        amount: data.amount,
        rewardType: data.type
      }
    };

    // Get existing notifications from localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('user-notifications') || '[]');
    
    // Add new notification to the beginning
    const updatedNotifications = [notification, ...existingNotifications.slice(0, 99)]; // Keep last 100
    
    // Save back to localStorage
    localStorage.setItem('user-notifications', JSON.stringify(updatedNotifications));
    
    // Trigger custom event to notify the main notification system
    window.dispatchEvent(new CustomEvent('rewardsNotificationAdded', { 
      detail: notification 
    }));

    // Show toast notification if user has notifications enabled
    const settings = JSON.parse(localStorage.getItem('notification-settings') || '{}');
    if (settings.enabled !== false && settings.types?.rewards !== false) {
      // Create and show a toast
      this.showToast(data);
    }
  }

  private showToast(data: RewardsNotificationData) {
    // Create a temporary toast element (this would integrate with your toast system)
    const toastEvent = new CustomEvent('showToast', {
      detail: {
        title: data.title,
        description: data.message,
        variant: data.priority === 'high' ? 'default' : 'default'
      }
    });
    window.dispatchEvent(toastEvent);
  }

  // Predefined notification templates for common rewards events
  notifyBattleVoteWin(amount: number, battleName: string) {
    this.addRewardsNotification({
      type: 'battle',
      title: 'Battle Vote Won! 🎯',
      message: `Your vote on ${battleName} was successful!`,
      amount,
      priority: 'high',
      actionUrl: '/app/rewards?tab=battles',
      actionLabel: 'View Details'
    });
  }

  notifyAchievementUnlocked(achievementName: string, reward: number) {
    this.addRewardsNotification({
      type: 'achievement',
      title: 'Achievement Unlocked! 🏆',
      message: `${achievementName} - Earned $${reward.toFixed(2)}`,
      amount: reward,
      priority: 'medium',
      actionUrl: '/app/rewards?tab=dashboard',
      actionLabel: 'View Achievement'
    });
  }

  notifyGiftReceived(giftName: string, amount: number, fromUser?: string) {
    this.addRewardsNotification({
      type: 'gift',
      title: 'Gift Received! 🎁',
      message: `Received ${giftName}${fromUser ? ` from ${fromUser}` : ''} - $${amount.toFixed(2)}`,
      amount,
      priority: 'medium',
      actionUrl: '/app/rewards?tab=activities',
      actionLabel: 'View Activity'
    });
  }

  notifyChallengeCompleted(challengeName: string, reward: number) {
    this.addRewardsNotification({
      type: 'challenge',
      title: 'Challenge Completed! ⭐',
      message: `${challengeName} - Earned $${reward.toFixed(2)}`,
      amount: reward,
      priority: 'low',
      actionUrl: '/app/rewards?tab=challenges',
      actionLabel: 'View Challenges'
    });
  }

  notifyGoalProgress(goalName: string, progress: number) {
    this.addRewardsNotification({
      type: 'goal',
      title: 'Goal Progress! 📈',
      message: `${goalName} - ${progress}% complete`,
      priority: 'low',
      actionUrl: '/app/rewards?tab=dashboard',
      actionLabel: 'View Goals'
    });
  }

  notifySeasonalEvent(eventName: string, bonus: string) {
    this.addRewardsNotification({
      type: 'bonus',
      title: 'Seasonal Event! ✨',
      message: `${eventName} is now active - ${bonus}`,
      priority: 'high',
      actionUrl: '/app/rewards?tab=dashboard',
      actionLabel: 'Join Event'
    });
  }

  notifyEarningsGoalReached(goalName: string, amount: number) {
    this.addRewardsNotification({
      type: 'goal',
      title: 'Goal Achieved! 🎉',
      message: `${goalName} completed - Earned $${amount.toFixed(2)} bonus!`,
      amount,
      priority: 'high',
      actionUrl: '/app/rewards?tab=dashboard',
      actionLabel: 'View Goals'
    });
  }

  notifyContentEarnings(contentType: string, amount: number) {
    this.addRewardsNotification({
      type: 'earning',
      title: 'Content Rewarded! ⚡',
      message: `Your ${contentType} earned $${amount.toFixed(2)}`,
      amount,
      priority: 'low',
      actionUrl: '/app/rewards?tab=activities',
      actionLabel: 'View Earnings'
    });
  }
}

export const rewardsNotificationService = new RewardsNotificationService();
export default rewardsNotificationService;
