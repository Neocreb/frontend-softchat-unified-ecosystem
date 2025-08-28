# Reward Sharing & Pioneer Badge Deployment Instructions

## 🚀 Database Migration

### 1. Set Environment Variables
```bash
export DATABASE_URL="your_neon_database_url"
```

### 2. Run Migration
```bash
# Run the reward sharing migration
npm run db:migrate:reward-sharing

# Or run manually
npx tsx scripts/create-reward-sharing-migration.ts
```

### 3. Verify Tables Created
The migration creates these tables:
- `reward_sharing_transactions` - Tracks all reward sharing
- `pioneer_badges` - First 500 user badges  
- `user_activity_sessions` - Activity tracking for eligibility
- Adds `automatic_sharing_enabled` column to `referral_links`

## 🔧 Integration Points

### 1. Existing Reward System Integration
Update your existing `ActivityRewardService` calls to include sharing:

```typescript
import { integrateRewardSharing } from '@/services/automaticRewardSharingService';

// After awarding points/rewards
await integrateRewardSharing(
  userId,
  rewardAmount, 
  'content_creation', // or other activity type
  activityId
);
```

### 2. Activity Sources That Trigger Sharing
- `content_creation` - Posts, videos, content
- `ad_revenue` - Ad viewing/clicking rewards  
- `engagement` - Likes, comments, shares
- `challenges` - Daily/weekly challenges
- `battle_voting` - Battle participation rewards
- `battle_rewards` - Battle performance bonuses
- `gifts_tips` - Received gifts and tips
- `creator_program` - Creator program earnings

### 3. Excluded Personal Earnings
- `freelance` - Project payments
- `marketplace` - Product sales  
- `crypto` - Trading profits
- `p2p` - Direct user payments
- `withdrawal` - Cash-out transactions

## 📊 Pioneer Badge Criteria

### Eligibility Requirements (75/100 points needed):
- **Account Age (20pts):** 7+ days old
- **Active Sessions (20pts):** 10+ quality sessions
- **Session Quality (20pts):** 5+ minutes average
- **Content Creation (20pts):** 3+ posts created
- **Community Engagement (20pts):** 10+ interactions

### Anti-Abuse Features:
- Device fingerprinting consistency
- Session pattern analysis
- Progressive scoring requirements
- Manual verification for edge cases

## 🎯 Testing

### 1. Test Reward Sharing
```typescript
// Test automatic sharing
const result = await AutomaticRewardSharingService.processRewardSharing({
  userId: 'test-user',
  rewardAmount: 100,
  sourceActivity: 'content_creation'
});

console.log('Shared:', result.sharedAmount); // Should be 0.5 (0.5% of 100)
```

### 2. Test Pioneer Badge
```typescript
// Check eligibility
const eligibility = await PioneerBadgeService.checkEligibility();
console.log('Eligible:', eligibility.isEligible);

// Track session for scoring
await PioneerBadgeService.trackSession({
  sessionStart: new Date(),
  activitiesCount: 5,
  qualityInteractions: 2
});
```

## 🔍 Monitoring

### Key Metrics to Track:
- Total reward sharing transactions/day
- Pioneer badge claims/day
- Remaining pioneer slots
- Sharing fraud attempts
- User eligibility progression

### Database Queries:
```sql
-- Check sharing activity
SELECT COUNT(*), SUM(shared_amount) 
FROM reward_sharing_transactions 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Check pioneer badge status
SELECT COUNT(*) as awarded, 500 - COUNT(*) as remaining 
FROM pioneer_badges;

-- Monitor eligibility scores
SELECT AVG(eligibility_score) as avg_score 
FROM pioneer_badges;
```

## ⚠️ Important Notes

1. **Legal Compliance:** All users automatically consent to reward sharing via Terms of Service
2. **Transparency:** Users can view all sharing transactions in their referral dashboard
3. **Performance:** Sharing happens asynchronously to avoid blocking user actions
4. **Rollback:** Can disable sharing by setting `automatic_sharing_enabled = false` in referral_links
5. **Pioneer Slots:** Hard limit of 500 badges - no more available once claimed
6. **Data Retention:** Keep all sharing and activity data for audit/compliance purposes

## 🚦 Production Readiness Checklist

- [ ] Database migration completed successfully
- [ ] Environment variables configured
- [ ] Legal pages updated and reviewed
- [ ] User notification system integrated
- [ ] Analytics/monitoring setup
- [ ] Fraud detection alerts configured
- [ ] Performance testing completed
- [ ] Security audit of sharing logic
- [ ] Customer support trained on new features
- [ ] Rollback plan documented
