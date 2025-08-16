# 🗂️ MOCK DATA CLEANUP & REAL-TIME INTEGRATION PLAN

## 📋 Mock Data Files to Remove/Update

### Files to DELETE (Not actively used):
```bash
# These files contain unused mock data
src/data/mockExploreData.ts          # Mock explore/trending data
src/data/mockFeedData.ts             # Mock posts and stories 
src/data/mockUsers.ts                # Mock user profiles
src/data/mockVideosData.ts           # Mock video content
src/data/sampleMemesGifsData.ts      # Mock memes/gifs
src/utils/mockDataGenerator.ts       # Mock data utilities
```

### Files to KEEP but MODIFY:
```bash
# These might be used for fallback/demo purposes
src/data/ (create new real-time data adapters)
```

---

## 🔄 INTEGRATION ROUTING UPDATES NEEDED

### 1. Update App.tsx - Add Real-Time Initialization

```tsx
// src/App.tsx - Add these imports and setup
import { websocketService } from './services/websocketService';
import { rewardService } from './services/rewardService';
import { useWebSocket } from './hooks/use-realtime';

// Add after line 628 in App.tsx
const AppWithRealTime = () => {
  const { user } = useAuth();
  const connectionStatus = useWebSocket();

  useEffect(() => {
    if (user) {
      // Initialize real-time services
      websocketService.connect(user.id, user.token);
      rewardService.initializeUserData(user.id);
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user]);

  return <AppRoutes />;
};

// Replace line 684: <AppRoutes /> with <AppWithRealTime />
```

### 2. Update Route Mappings for Real-Time Components

```tsx
// In App.tsx, replace these routes with real-time versions:

// OLD: Line 456 - Videos
<Route path="videos" element={<EnhancedTikTokVideosV3 />} />
// NEW: 
<Route path="videos" element={<Watch2EarnVideosPage />} />

// OLD: Line 449 - Crypto
<Route path="crypto" element={<ProfessionalCrypto />} />
// NEW:
<Route path="crypto" element={<RealTimeCryptoPage />} />

// OLD: Line 450-453 - Crypto sub-routes
<Route path="crypto-trading" element={<CryptoTrading />} />
<Route path="crypto-p2p" element={<CryptoP2P />} />
// NEW:
<Route path="crypto-trading" element={<RealTimeTradingPage />} />
<Route path="crypto-p2p" element={<P2PEscrowPage />} />

// OLD: Line 387-388 - Chat
<Route path="chat" element={<Chat />} />
<Route path="chat/:threadId" element={<ChatRoom />} />
// NEW:
<Route path="chat" element={<RealTimeChatPage />} />
<Route path="chat/:threadId" element={<RealTimeChatRoom />} />

// OLD: Line 500-501 - Creator Studio
<Route path="creator-studio" element={<CreatorStudio />} />
<Route path="unified-creator-studio" element={<UnifiedCreatorStudio />} />
// NEW:
<Route path="creator-studio" element={<RealTimeCreatorStudio />} />
```

---

## 📝 NEW PAGE COMPONENTS TO CREATE

### 1. Real-Time Video Page
```tsx
// src/pages/Watch2EarnVideosPage.tsx
import React from 'react';
import { Watch2EarnPlayer } from '../components/video/Watch2EarnPlayer';

export default function Watch2EarnVideosPage() {
  return <Watch2EarnPlayer videoId="current-video-id" />;
}
```

### 2. Real-Time Crypto Trading Page  
```tsx
// src/pages/RealTimeCryptoPage.tsx
import React from 'react';
import { RealTimeTradingBoard } from '../components/crypto/RealTimeTradingBoard';

export default function RealTimeCryptoPage() {
  return <RealTimeTradingBoard tradingPair="BTC/USD" />;
}
```

### 3. P2P Escrow Page
```tsx
// src/pages/P2PEscrowPage.tsx
import React from 'react';
import { P2PEscrowManager } from '../components/crypto/P2PEscrowManager';

export default function P2PEscrowPage() {
  const { transactionId } = useParams();
  return <P2PEscrowManager transactionId={transactionId!} userRole="buyer" />;
}
```

### 4. Real-Time Chat Pages
```tsx
// src/pages/RealTimeChatPage.tsx
import React from 'react';
import { useRealTimeChat } from '../hooks/use-realtime';

export default function RealTimeChatPage() {
  const { messages, sendMessage } = useRealTimeChat();
  return (
    <div className="h-full flex flex-col">
      {/* Chat interface using real-time hooks */}
    </div>
  );
}

// src/pages/RealTimeChatRoom.tsx  
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRealTimeChat } from '../hooks/use-realtime';

export default function RealTimeChatRoom() {
  const { threadId } = useParams();
  const { messages, sendMessage, typingUsers } = useRealTimeChat(threadId);
  
  return (
    <div className="h-full flex flex-col">
      {/* Real-time chat room interface */}
    </div>
  );
}
```

### 5. Real-Time Creator Studio
```tsx
// src/pages/RealTimeCreatorStudio.tsx
import React from 'react';
import { RealTimeCreatorDashboard } from '../components/creator-economy/RealTimeCreatorDashboard';
import { useAuth } from '../contexts/AuthContext';

export default function RealTimeCreatorStudio() {
  const { user } = useAuth();
  return <RealTimeCreatorDashboard creatorId={user?.id || ''} />;
}
```

---

## 🔧 CONTEXT UPDATES NEEDED

### 1. Update FeedContext to use Real-Time
```tsx
// src/contexts/FeedContext.tsx - Replace mock data with real API calls
const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  
  // Replace mock data loading with real API
  useEffect(() => {
    // OLD: setPosts(mockPosts);
    // NEW: 
    fetchPosts().then(setPosts);
  }, []);

  // Add real-time post updates
  useSocketEvent('new_post', (data) => {
    setPosts(prev => [data.post, ...prev]);
  });

  // ... rest of context
};
```

### 2. Update MarketplaceContext for Real-Time
```tsx
// src/contexts/EnhancedMarketplaceContext.tsx
const MarketplaceProvider = ({ children }) => {
  // Replace mock product data with real API calls
  useEffect(() => {
    // OLD: setProducts(mockProducts);
    // NEW:
    fetchProducts().then(setProducts);
  }, []);

  // Add real-time product updates
  useSocketEvent('product_updated', (data) => {
    setProducts(prev => 
      prev.map(p => p.id === data.productId ? { ...p, ...data.updates } : p)
    );
  });
};
```

### 3. Update ChatContext for Real-Time
```tsx
// src/contexts/ChatContext.tsx
const ChatProvider = ({ children }) => {
  // Replace with real-time chat hooks
  const { messages, sendMessage, onlineUsers } = useRealTimeChat();
  
  // Remove mock data, use real-time hooks
};
```

---

## 🗃️ DATABASE MIGRATION CONSIDERATIONS

### Required API Endpoints (Backend)
```javascript
// User & Authentication
GET /api/auth/user                     // Get current user
POST /api/auth/login                   // Login
POST /api/auth/register                // Register

// Real-Time Feed
GET /api/feed                          // Get feed posts
POST /api/feed/post                    // Create post
POST /api/feed/like                    // Like post
POST /api/feed/comment                 // Comment on post

// Real-Time Chat  
GET /api/chat/rooms                    // Get chat rooms
GET /api/chat/rooms/:id/messages       // Get messages
POST /api/chat/rooms/:id/messages      // Send message

// Real-Time Trading
GET /api/crypto/trading/pairs          // Get trading pairs
POST /api/crypto/trading/orders        // Create order
GET /api/crypto/trading/orderbook/:pair // Get order book
GET /api/crypto/prices/:symbol         // Get real-time prices

// Real-Time Videos
GET /api/videos                        // Get videos
GET /api/videos/:id                    // Get video details
POST /api/videos/:id/view              // Track view
POST /api/videos/:id/ads/complete      // Complete ad view

// Creator Economy
GET /api/creator/stats/:id             // Get creator stats
GET /api/creator/:id/analytics         // Get analytics
POST /api/creator/tips                 // Send tip

// Marketplace
GET /api/marketplace/products          // Get products
POST /api/marketplace/orders           // Create order
GET /api/marketplace/orders/:id        // Get order status

// Notifications
GET /api/notifications                 // Get notifications
PUT /api/notifications/:id/read        // Mark as read

// Rewards
GET /api/rewards/user                  // Get user rewards
POST /api/rewards/trigger              // Trigger reward
```

---

## ⚡ STEP-BY-STEP IMPLEMENTATION

### Phase 1: Clean Up Mock Data
```bash
# Delete unused mock files
rm src/data/mockExploreData.ts
rm src/data/mockFeedData.ts  
rm src/data/mockUsers.ts
rm src/data/mockVideosData.ts
rm src/data/sampleMemesGifsData.ts
rm src/utils/mockDataGenerator.ts
```

### Phase 2: Create New Page Components
```bash
# Create real-time page components
touch src/pages/Watch2EarnVideosPage.tsx
touch src/pages/RealTimeCryptoPage.tsx
touch src/pages/P2PEscrowPage.tsx
touch src/pages/RealTimeChatPage.tsx
touch src/pages/RealTimeChatRoom.tsx
touch src/pages/RealTimeCreatorStudio.tsx
```

### Phase 3: Update Routing
```tsx
// Update App.tsx imports and routes
import Watch2EarnVideosPage from './pages/Watch2EarnVideosPage';
import RealTimeCryptoPage from './pages/RealTimeCryptoPage';
import P2PEscrowPage from './pages/P2PEscrowPage';
import RealTimeChatPage from './pages/RealTimeChatPage';  
import RealTimeChatRoom from './pages/RealTimeChatRoom';
import RealTimeCreatorStudio from './pages/RealTimeCreatorStudio';
```

### Phase 4: Update Contexts
```tsx
// Replace mock data calls in all context files with real API calls
// Add real-time event listeners using useSocketEvent hook
```

### Phase 5: Environment Configuration
```bash
# Add to .env or environment variables
REACT_APP_WEBSOCKET_URL=ws://localhost:3001
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_ENABLE_REALTIME=true
```

---

## 🧪 TESTING REAL-TIME INTEGRATION

### Development Testing Steps
1. **WebSocket Connection**: Test connection/disconnection
2. **Real-Time Chat**: Send/receive messages
3. **Live Trading**: Price updates and order changes  
4. **Video Rewards**: Ad completion and watch rewards
5. **Creator Analytics**: Live stats updates
6. **Notifications**: Real-time notifications

### Testing Commands
```bash
# Test WebSocket connection
npm run dev
# Open browser console, check for WebSocket logs

# Test real-time features
# Open multiple browser tabs/windows
# Trigger actions in one tab, verify updates in others
```

---

## 🚦 FEATURE FLAGS FOR GRADUAL ROLLOUT

```tsx
// src/config/features.ts
export const FEATURES = {
  ENABLE_REALTIME: process.env.REACT_APP_ENABLE_REALTIME === 'true',
  ENABLE_REALTIME_CHAT: true,
  ENABLE_REALTIME_TRADING: true,
  ENABLE_WATCH2EARN: true,
  ENABLE_CREATOR_ANALYTICS: true,
};

// Use in components
if (FEATURES.ENABLE_REALTIME_CHAT) {
  // Use real-time chat
} else {
  // Use legacy chat
}
```

---

## 📊 PERFORMANCE MONITORING

### Add Performance Tracking
```tsx
// src/utils/performance.ts
export const trackRealTimePerformance = () => {
  // Track WebSocket connection time
  // Track message delivery latency  
  // Track API response times
  // Track component render times
};
```

---

## ✅ COMPLETION CHECKLIST

- [ ] Remove unused mock data files
- [ ] Create new real-time page components
- [ ] Update App.tsx routing
- [ ] Update all context providers
- [ ] Add WebSocket initialization to App.tsx
- [ ] Configure environment variables
- [ ] Test real-time features
- [ ] Add performance monitoring
- [ ] Deploy and verify production

🎯 **Goal**: Replace all mock data with real-time API calls and ensure seamless user experience with live updates.
