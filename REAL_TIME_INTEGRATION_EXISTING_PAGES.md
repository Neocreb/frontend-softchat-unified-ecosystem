# 🔄 REAL-TIME INTEGRATION FOR EXISTING PAGES

## 📋 Integration Strategy - Update Existing Components

### ❌ DO NOT CREATE NEW PAGES
- ✅ Update existing video page components  
- ✅ Integrate Watch2Earn into current video feeds
- ✅ Add real-time trading to existing crypto page
- ✅ Replace mock data with real API calls

---

## 🎬 VIDEO PAGE INTEGRATION (Watch2Earn)

### 1. Update Existing Video Components

#### Find Current Video Page Component:
```bash
# Locate the current video page (likely one of these):
src/pages/EnhancedTikTokVideosV3.tsx
src/pages/TikTokStyleVideos.tsx  
src/pages/EnhancedVideosV2.tsx
```

#### Integration Steps:

**Step 1: Add Watch2Earn to Video Player**
```tsx
// In your existing video component (e.g., EnhancedTikTokVideosV3.tsx)
import { useRewardService } from '../services/rewardService';
import { useSocketEvent } from '../hooks/use-realtime';

const VideoPlayer = ({ video }) => {
  const { viewAd, watchVideo } = useRewardService();
  const [watchTime, setWatchTime] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adData, setAdData] = useState(null);

  // Check for ad insertion every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (watchTime > 0 && watchTime % 30 === 0) {
        // Fetch and show ad
        fetchInlineAd().then(setAdData);
        setShowAd(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [watchTime]);

  // Track watch time for rewards
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchTime(prev => prev + 1);
      
      // Trigger watch reward every minute
      if (watchTime > 0 && watchTime % 60 === 0) {
        watchVideo(video.id, watchTime);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Your existing video player */}
      <video {...videoProps} />
      
      {/* Inline Ad Overlay */}
      {showAd && adData && (
        <InlineAdOverlay 
          ad={adData}
          onComplete={() => {
            viewAd(adData.id, video.id);
            setShowAd(false);
          }}
          onSkip={() => setShowAd(false)}
        />
      )}
      
      {/* Watch2Earn Progress Indicator */}
      <div className="absolute top-4 right-4">
        <WatchTimeIndicator watchTime={watchTime} />
      </div>
    </div>
  );
};
```

**Step 2: Create Inline Ad Component**
```tsx
// src/components/video/InlineAdOverlay.tsx
import React, { useState, useEffect } from 'react';

export const InlineAdOverlay = ({ ad, onComplete, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(ad.duration || 15);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        if (prev === 10) setCanSkip(true); // Allow skip after 5 seconds
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto text-center">
        <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover rounded mb-4" />
        <h3 className="text-lg font-bold mb-2">{ad.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{ad.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Ad • {timeLeft}s remaining
          </div>
          {canSkip ? (
            <button onClick={onSkip} className="text-blue-600 text-sm">
              Skip Ad
            </button>
          ) : (
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${((ad.duration - timeLeft) / ad.duration) * 100}%` }}
              />
            </div>
          )}
        </div>
        
        <button 
          onClick={() => window.open(ad.url, '_blank')}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          {ad.cta || 'Learn More'}
        </button>
      </div>
    </div>
  );
};
```

---

## 💰 CRYPTO PAGE INTEGRATION (Real-Time Trading)

### 1. Update Existing Crypto Component

#### Find Current Crypto Page:
```bash
# Locate current crypto page:
src/pages/ProfessionalCrypto.tsx
src/pages/EnhancedCrypto.tsx
src/pages/CryptoMarket.tsx
```

#### Integration Steps:

**Step 1: Add Real-Time Trading Board**
```tsx
// In your existing crypto page (e.g., ProfessionalCrypto.tsx)
import { RealTimeTradingBoard } from '../components/crypto/RealTimeTradingBoard';
import { useRealTimeTrading } from '../hooks/use-realtime';

const CryptoPage = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USD');
  
  return (
    <div className="crypto-page">
      {/* Your existing crypto header/navigation */}
      
      {/* Replace existing trading section with real-time board */}
      <div className="trading-section">
        <RealTimeTradingBoard 
          tradingPair={selectedPair}
          onTradeSelect={(trade) => console.log('Trade selected:', trade)}
        />
      </div>
      
      {/* Your existing portfolio/wallet sections */}
    </div>
  );
};
```

**Step 2: Add P2P Trading Tab**
```tsx
// Add P2P tab to existing crypto page
const CryptoTabs = () => {
  return (
    <Tabs defaultValue="trading">
      <TabsList>
        <TabsTrigger value="trading">Spot Trading</TabsTrigger>
        <TabsTrigger value="p2p">P2P Trading</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trading">
        <RealTimeTradingBoard tradingPair="BTC/USD" />
      </TabsContent>
      
      <TabsContent value="p2p">
        <P2PEscrowManager transactionId="current-transaction" userRole="buyer" />
      </TabsContent>
    </Tabs>
  );
};
```

---

## 🗂️ MOCK DATA REMOVAL PLAN

### 1. Files to DELETE:
```bash
rm src/data/mockExploreData.ts
rm src/data/mockFeedData.ts  
rm src/data/mockUsers.ts
rm src/data/mockVideosData.ts
rm src/data/sampleMemesGifsData.ts
rm src/utils/mockDataGenerator.ts
```

### 2. Replace Mock Data in Existing Components:

#### A. Feed/Post Components:
```tsx
// Find components using mock posts (likely in):
src/components/feed/
src/pages/EnhancedFeed.tsx
src/pages/EnhancedFeedWithTabs.tsx

// Replace mock data with real API:
// OLD:
const [posts, setPosts] = useState(mockPosts);

// NEW:
const [posts, setPosts] = useState([]);
useEffect(() => {
  fetch('/api/feed/posts')
    .then(res => res.json())
    .then(setPosts);
}, []);

// Add real-time updates:
useSocketEvent('new_post', (data) => {
  setPosts(prev => [data.post, ...prev]);
});
```

#### B. Video Components:
```tsx
// Find video components using mock data:
src/components/video/
src/pages/EnhancedTikTokVideosV3.tsx

// Replace with real API:
// OLD:
const [videos, setVideos] = useState(mockVideos);

// NEW:
const [videos, setVideos] = useState([]);
useEffect(() => {
  fetch('/api/videos')
    .then(res => res.json())
    .then(setVideos);
}, []);

// Add Watch2Earn tracking:
const handleVideoView = (videoId, watchTime) => {
  fetch('/api/videos/' + videoId + '/view', {
    method: 'POST',
    body: JSON.stringify({ watchTime })
  });
};
```

#### C. User/Profile Components:
```tsx
// Find profile components:
src/components/profile/
src/pages/EnhancedProfile.tsx

// Replace mock users with real API:
// OLD:
const [user, setUser] = useState(mockUser);

// NEW:
const [user, setUser] = useState(null);
useEffect(() => {
  fetch('/api/users/' + username)
    .then(res => res.json())
    .then(setUser);
}, [username]);
```

#### D. Marketplace Components:
```tsx
// Find marketplace components:
src/pages/EnhancedMarketplace.tsx
src/components/marketplace/

// Replace mock products:
// OLD:
const [products, setProducts] = useState(mockProducts);

// NEW:
const [products, setProducts] = useState([]);
useEffect(() => {
  fetch('/api/marketplace/products')
    .then(res => res.json())
    .then(setProducts);
}, []);

// Add real-time product updates:
useSocketEvent('product_updated', (data) => {
  setProducts(prev => 
    prev.map(p => p.id === data.productId ? { ...p, ...data.updates } : p)
  );
});
```

---

## 🔄 CONTEXT UPDATES

### 1. Update FeedContext:
```tsx
// src/contexts/FeedContext.tsx
import { useSocketEvent } from '../hooks/use-realtime';

const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace mock data with real API
  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  // Real-time post updates
  useSocketEvent('new_post', (data) => {
    setPosts(prev => [data.post, ...prev]);
  });

  useSocketEvent('post_updated', (data) => {
    setPosts(prev => 
      prev.map(p => p.id === data.postId ? { ...p, ...data.updates } : p)
    );
  });

  const fetchPosts = async () => {
    const response = await fetch('/api/feed/posts');
    return response.json();
  };

  return (
    <FeedContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </FeedContext.Provider>
  );
};
```

### 2. Update ChatContext:
```tsx
// src/contexts/ChatContext.tsx
import { useRealTimeChat } from '../hooks/use-realtime';

const ChatProvider = ({ children }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  const { messages, sendMessage, typingUsers } = useRealTimeChat(activeRoom);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      typingUsers,
      activeRoom,
      setActiveRoom
    }}>
      {children}
    </ChatContext.Provider>
  );
};
```

---

## 🎯 IMPLEMENTATION STEPS

### Phase 1: Remove Mock Data
```bash
# Delete mock files
rm src/data/mockExploreData.ts src/data/mockFeedData.ts src/data/mockUsers.ts src/data/mockVideosData.ts src/data/sampleMemesGifsData.ts src/utils/mockDataGenerator.ts
```

### Phase 2: Update Video Page
```bash
# 1. Find your current video page component
# 2. Add Watch2Earn functionality with inline ads
# 3. Replace any mock video data with real API calls
# 4. Add real-time tracking for views and rewards
```

### Phase 3: Update Crypto Page  
```bash
# 1. Find your current crypto page component
# 2. Integrate RealTimeTradingBoard component
# 3. Add P2P trading functionality
# 4. Replace mock trading data with real APIs
```

### Phase 4: Update All Other Components
```bash
# 1. Search for all components using mock data
# 2. Replace with real API calls
# 3. Add real-time WebSocket listeners where needed
# 4. Test each component individually
```

### Phase 5: Test Real-Time Features
```bash
# 1. Test WebSocket connections
# 2. Test ad insertion in videos
# 3. Test real-time trading updates
# 4. Test reward system functionality
```

---

## 🛠️ API ENDPOINTS NEEDED

```javascript
// Videos & Watch2Earn
GET  /api/videos                       // Get video feed
GET  /api/videos/:id                   // Get specific video
POST /api/videos/:id/view              // Track video view
GET  /api/ads/inline                   // Get inline ads
POST /api/ads/:id/view                 // Track ad view

// Feed & Posts  
GET  /api/feed/posts                   // Get feed posts
POST /api/feed/posts                   // Create post
POST /api/feed/posts/:id/like          // Like post
POST /api/feed/posts/:id/comment       // Comment on post

// Trading & Crypto
GET  /api/crypto/prices/:symbol        // Get real-time prices
GET  /api/crypto/orderbook/:pair       // Get order book
POST /api/crypto/orders                // Create order
GET  /api/crypto/p2p/offers            // Get P2P offers

// Users & Profiles
GET  /api/users/:username              // Get user profile
PUT  /api/users/:id                    // Update user profile
GET  /api/users/:id/stats              // Get user statistics

// Marketplace
GET  /api/marketplace/products         // Get products
POST /api/marketplace/orders           // Create order
GET  /api/marketplace/orders/:id       // Get order status

// Rewards
GET  /api/rewards/user                 // Get user rewards
POST /api/rewards/trigger              // Trigger reward action

// Real-time WebSocket Events
'new_post'              // New post in feed
'post_updated'          // Post updated (likes/comments)
'price_update'          // Crypto price update
'order_update'          // Trading order update
'ad_view_complete'      // Ad view completed
'reward_earned'         // Reward earned
'message_received'      // New chat message
```

---

## ✅ FINAL RESULT

After implementation, your existing pages will have:

- **Video Page**: Watch2Earn with inline Facebook-style ads
- **Crypto Page**: Real-time trading with live price updates
- **Feed Page**: Real-time posts with live updates
- **Chat**: Real-time messaging
- **Profile**: Real-time stats and activities

All using **real APIs** instead of mock data, with **WebSocket real-time updates** throughout the platform.
