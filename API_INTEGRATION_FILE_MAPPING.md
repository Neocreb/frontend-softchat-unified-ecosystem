# 📁 EXACT FILE MAPPING FOR API INTEGRATION

## 🎯 WHERE TO INTEGRATE AFRICAN APIS

### ✅ **EXISTING FILES TO UPDATE**

#### 1. **`src/services/africanPaymentService.ts`** ✅ Already Exists!
**Current Status**: Contains mock data and providers  
**Action Required**: Replace mock methods with real API calls

```typescript
// REPLACE these mock methods with real API calls:

// Line 188-213: Replace processBankTransfer() 
async processBankTransfer(request: BankTransferRequest): Promise<PaymentResponse> {
  // REPLACE with Flutterwave Bank Transfer API
  const flutterwave = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
  const payload = {
    tx_ref: this.generateReference(),
    amount: request.amount,
    currency: request.currency,
    redirect_url: "https://yourapp.com/payment/callback",
    payment_options: "banktransfer",
    customer: {
      email: request.accountName + "@temp.com", // Use actual customer email
      name: request.accountName
    }
  };
  const response = await flutterwave.StandardSubaccount.create(payload);
  return response;
}

// Line 243-279: Replace processMobileMoneyDeposit()
async processMobileMoneyDeposit(request: MobileMoneyRequest): Promise<PaymentResponse> {
  // REPLACE with MTN Mobile Money API
  const mtnMoMoConfig = {
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    baseUrl: 'https://sandbox.momodeveloper.mtn.com'
  };
  
  const paymentRequest = {
    amount: request.amount.toString(),
    currency: request.currency,
    externalId: request.reference,
    payer: {
      partyIdType: "MSISDN",
      partyId: request.phoneNumber.replace('+', '')
    }
  };
  
  const response = await fetch(`${mtnMoMoConfig.baseUrl}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await getMtnAccessToken()}`,
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': mtnMoMoConfig.subscriptionKey
    },
    body: JSON.stringify(paymentRequest)
  });
  
  return await response.json();
}
```

#### 2. **`src/services/kycService.ts`** ✅ Already Exists!
**Current Status**: Uses Supabase for document storage  
**Action Required**: Add African KYC providers

```typescript
// ADD these new methods to existing kycService:

// Add after line 145:
async verifyWithSmileIdentity(userData: any): Promise<any> {
  const smileIdentityConfig = {
    partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
    apiKey: process.env.SMILE_IDENTITY_API_KEY,
    baseUrl: 'https://3eydmgh10d.execute-api.us-west-2.amazonaws.com/test'
  };

  const verification = {
    partner_id: smileIdentityConfig.partnerId,
    job_id: Date.now().toString(),
    job_type: 4, // Enhanced KYC
    country: userData.country,
    id_type: userData.idType,
    id_number: userData.idNumber,
    first_name: userData.firstName,
    last_name: userData.lastName,
    phone_number: userData.phoneNumber
  };

  const response = await fetch(`${smileIdentityConfig.baseUrl}/identity_verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verification)
  });

  return await response.json();
},

async verifyBVN(bvn: string, userData: any): Promise<any> {
  const youverifyConfig = {
    token: process.env.YOUVERIFY_TOKEN,
    baseUrl: 'https://api.youverify.co/v2'
  };

  const response = await fetch(`${youverifyConfig.baseUrl}/identity/ng/bvn`, {
    method: 'POST',
    headers: {
      'Token': youverifyConfig.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: bvn,
      isSubjectConsent: true,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone
    })
  });

  return await response.json();
}
```

#### 3. **`src/services/cryptoService.ts`** ✅ Already Exists!
**Current Status**: Contains comprehensive mock data  
**Action Required**: Replace mock methods with real APIs

```typescript
// REPLACE these mock methods starting from line 422:

// Replace getCryptocurrencies() method (line 452-464)
async getCryptocurrencies(limit = 100, sortBy = "market_cap_desc"): Promise<Cryptocurrency[]> {
  // REPLACE mock data with CoinGecko API
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
    {
      headers: {
        'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
      }
    }
  );
  return await response.json();
}

// Replace getMarketData() method (line 466-502)
async getMarketData(): Promise<MarketData> {
  // REPLACE with real CoinGecko global data
  const response = await fetch('https://api.coingecko.com/api/v3/global', {
    headers: {
      'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
    }
  });
  const data = await response.json();
  
  return {
    globalStats: {
      totalMarketCap: data.data.total_market_cap.usd,
      totalVolume24h: data.data.total_volume.usd,
      marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
      btcDominance: data.data.market_cap_percentage.btc,
      ethDominance: data.data.market_cap_percentage.eth,
      activeCoins: data.data.active_cryptocurrencies,
      markets: data.data.markets
    },
    // ... rest of the mapping
  };
}

// ADD real-time WebSocket integration
private startRealTimePriceUpdates() {
  const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'subscribe',
      product_ids: ['BTC-USD', 'ETH-USD', 'BNB-USD'],
      channels: ['ticker']
    }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'ticker') {
      // Emit real-time price updates via WebSocket service
      websocketService.emit('price_update', {
        symbol: data.product_id.replace('-', '/'),
        price: parseFloat(data.price),
        change: parseFloat(data.price) - parseFloat(data.open_24h)
      });
    }
  };
}
```

#### 4. **`src/lib/api.ts`** ✅ Already Exists!
**Current Status**: Basic API client setup  
**Action Required**: Add African-specific endpoints

```typescript
// ADD these methods to the ApiClient class after line 152:

// African Payment Methods
async initializeFlutterwavePayment(paymentData: any) {
  return this.request("/payments/flutterwave/initialize", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

async processMobileMoneyPayment(paymentData: any) {
  return this.request("/payments/mobile-money", {
    method: "POST", 
    body: JSON.stringify(paymentData),
  });
}

// KYC Methods  
async submitKYCDocument(documentData: any) {
  return this.request("/kyc/documents", {
    method: "POST",
    body: JSON.stringify(documentData),
  });
}

async verifyBVN(bvnData: any) {
  return this.request("/kyc/verify/bvn", {
    method: "POST",
    body: JSON.stringify(bvnData),
  });
}

// Real-time API Methods
async getVideos(limit = 50, offset = 0) {
  return this.request(`/videos?limit=${limit}&offset=${offset}`);
}

async trackVideoView(videoId: string, watchTime: number) {
  return this.request(`/videos/${videoId}/view`, {
    method: "POST",
    body: JSON.stringify({ watchTime }),
  });
}

async getInlineAd() {
  return this.request("/ads/inline");
}

async trackAdView(adId: string, watchDuration: number) {
  return this.request(`/ads/${adId}/view`, {
    method: "POST",
    body: JSON.stringify({ watchDuration }),
  });
}

// Trading API Methods
async getCryptoOrderBook(tradingPair: string) {
  return this.request(`/crypto/orderbook/${tradingPair}`);
}

async createCryptoOrder(orderData: any) {
  return this.request("/crypto/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

async getCryptoPrices(symbols: string[]) {
  return this.request(`/crypto/prices?symbols=${symbols.join(',')}`);
}

// Rewards API Methods  
async getUserRewards() {
  return this.request("/rewards/user");
}

async triggerReward(action: string, metadata: any) {
  return this.request("/rewards/trigger", {
    method: "POST",
    body: JSON.stringify({ action, metadata }),
  });
}

// Creator Economy Methods
async getCreatorStats(creatorId: string) {
  return this.request(`/creator/stats/${creatorId}`);
}

async sendTip(recipientId: string, amount: number, message?: string) {
  return this.request("/creator/tips", {
    method: "POST", 
    body: JSON.stringify({ recipientId, amount, message }),
  });
}
```

---

## 🗂️ **NEW SERVICE FILES TO CREATE**

### 1. **`src/services/africanSmsService.ts`** (NEW)
```typescript
// Create this file for African SMS/communication services
import { africasTalkingConfig, termiiConfig } from '../config/africanServices';

export class AfricanSmsService {
  // Africa's Talking SMS integration
  async sendSMSOTP(phoneNumber: string, otp: string): Promise<any> {
    // Implementation from AFRICAN_EXTERNAL_SERVICES_INTEGRATION.md
  }
  
  // Termii multi-channel messaging
  async sendMultiChannelOTP(phoneNumber: string, channel: string): Promise<any> {
    // Implementation from AFRICAN_EXTERNAL_SERVICES_INTEGRATION.md  
  }
}

export const africanSmsService = new AfricanSmsService();
```

### 2. **`src/services/africanKycService.ts`** (NEW)
```typescript
// Create this file for African KYC integrations
export class AfricanKycService {
  async verifyWithSmileIdentity(userData: any): Promise<any> {
    // Implementation from AFRICAN_EXTERNAL_SERVICES_INTEGRATION.md
  }
  
  async verifyBVN(bvn: string, userData: any): Promise<any> {
    // Implementation from AFRICAN_EXTERNAL_SERVICES_INTEGRATION.md
  }
  
  async verifyGhanaCard(cardNumber: string, userData: any): Promise<any> {
    // Implementation from AFRICAN_EXTERNAL_SERVICES_INTEGRATION.md
  }
}

export const africanKycService = new AfricanKycService();
```

### 3. **`src/services/realTimeVideoService.ts`** (NEW)
```typescript
// Create this file for Watch2Earn functionality
export class RealTimeVideoService {
  async getVideosWithAds(): Promise<any[]> {
    // Fetch videos with inline ad configuration
    const response = await fetch('/api/videos');
    return await response.json();
  }
  
  async trackVideoView(videoId: string, watchTime: number): Promise<any> {
    // Track video viewing for rewards
    const response = await fetch(`/api/videos/${videoId}/view`, {
      method: 'POST',
      body: JSON.stringify({ watchTime })
    });
    return await response.json();
  }
  
  async getInlineAd(): Promise<any> {
    // Get inline ad for video
    const response = await fetch('/api/ads/inline');
    return await response.json();
  }
  
  async completeAdView(adId: string, videoId: string, watchDuration: number): Promise<any> {
    // Complete ad view and trigger reward
    const response = await fetch(`/api/ads/${adId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ videoId, watchDuration })
    });
    return await response.json();
  }
}

export const realTimeVideoService = new RealTimeVideoService();
```

---

## 🔧 **CONFIGURATION FILES TO CREATE**

### 1. **`src/config/africanServices.ts`** (NEW)
```typescript
// Create this file for all African service configurations
export const africanServicesConfig = {
  flutterwave: {
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    baseUrl: 'https://api.flutterwave.com/v3'
  },
  
  mtnMomo: {
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    apiKey: process.env.MTN_MOMO_API_KEY,
    baseUrl: 'https://sandbox.momodeveloper.mtn.com'
  },
  
  smileIdentity: {
    partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
    apiKey: process.env.SMILE_IDENTITY_API_KEY,
    baseUrl: 'https://3eydmgh10d.execute-api.us-west-2.amazonaws.com/test'
  },
  
  africasTalking: {
    apiKey: process.env.AFRICAS_TALKING_API_KEY,
    username: process.env.AFRICAS_TALKING_USERNAME
  },
  
  termii: {
    apiKey: process.env.TERMII_API_KEY,
    baseUrl: 'https://api.ng.termii.com/api'
  }
};
```

### 2. **`src/config/realTimeConfig.ts`** (NEW)
```typescript
// Create this file for real-time configuration
export const realTimeConfig = {
  websocket: {
    url: process.env.WEBSOCKET_URL || 'ws://localhost:3001',
    reconnectAttempts: 5,
    reconnectDelay: 1000
  },
  
  apis: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
    coingecko: {
      apiKey: process.env.COINGECKO_API_KEY,
      baseUrl: 'https://api.coingecko.com/api/v3'
    },
    binance: {
      apiKey: process.env.BINANCE_API_KEY,
      secretKey: process.env.BINANCE_SECRET_KEY,
      baseUrl: 'https://api.binance.com/api/v3'
    }
  },
  
  features: {
    enableRealTimeChat: true,
    enableWatch2Earn: true,
    enableRealTimeTrading: true,
    enableInlineAds: true
  }
};
```

---

## 📱 **COMPONENTS TO UPDATE**

### 1. **Update Video Components**
Find your current video component (one of these):
- `src/pages/EnhancedTikTokVideosV3.tsx`
- `src/pages/TikTokStyleVideos.tsx`
- `src/pages/EnhancedVideosV2.tsx`

**Add Watch2Earn integration:**
```typescript
// ADD these imports to your video component:
import { useRewardService } from '../services/rewardService';
import { InlineAdOverlay } from '../components/video/InlineAdOverlay';
import { realTimeVideoService } from '../services/realTimeVideoService';

// ADD these state variables:
const [watchTime, setWatchTime] = useState(0);
const [showAd, setShowAd] = useState(false);
const [adData, setAdData] = useState(null);

// ADD this effect for ad insertion:
useEffect(() => {
  const interval = setInterval(() => {
    if (watchTime > 0 && watchTime % 30 === 0) {
      realTimeVideoService.getInlineAd().then(setAdData);
      setShowAd(true);
    }
  }, 1000);
  return () => clearInterval(interval);
}, [watchTime]);
```

### 2. **Update Crypto Trading Components**
Find your current crypto page:
- `src/pages/ProfessionalCrypto.tsx`
- `src/pages/EnhancedCrypto.tsx`

**Add real-time trading:**
```typescript
// ADD these imports:
import { RealTimeTradingBoard } from '../components/crypto/RealTimeTradingBoard';
import { P2PEscrowManager } from '../components/crypto/P2PEscrowManager';

// REPLACE existing trading section with:
<div className="trading-section">
  <RealTimeTradingBoard tradingPair="BTC/USD" />
</div>
```

### 3. **Update Payment Components**
Find and update components in:
- `src/components/wallet/`
- `src/pages/Wallet.tsx`

**Add African payment methods:**
```typescript
// ADD these imports:
import { africanPaymentService } from '../services/africanPaymentService';

// ADD payment method selection UI
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('flutterwave');
const [mobileMoneyProvider, setMobileMoneyProvider] = useState('mtn_momo');

// ADD payment processing
const handlePayment = async (amount: number) => {
  if (selectedPaymentMethod === 'mobile_money') {
    return await africanPaymentService.processMobileMoneyDeposit({
      provider: mobileMoneyProvider,
      phoneNumber: userPhone,
      amount,
      currency: 'USD',
      reference: generateReference()
    });
  }
  // ... other payment methods
};
```

---

## 🚀 **ENVIRONMENT VARIABLES TO ADD**

Update your `.env` file:
```bash
# Add these African service variables:
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
MTN_MOMO_SUBSCRIPTION_KEY=xxx
MTN_MOMO_API_KEY=xxx
SMILE_IDENTITY_PARTNER_ID=xxx
SMILE_IDENTITY_API_KEY=xxx
AFRICAS_TALKING_API_KEY=xxx
AFRICAS_TALKING_USERNAME=xxx
TERMII_API_KEY=xxx
YOUVERIFY_TOKEN=xxx

# Add these real-time service variables:
WEBSOCKET_URL=ws://localhost:3001
COINGECKO_API_KEY=xxx
BINANCE_API_KEY=xxx
BINANCE_SECRET_KEY=xxx

# Add these feature flags:
ENABLE_REALTIME_FEATURES=true
ENABLE_AFRICAN_PAYMENTS=true
ENABLE_WATCH2EARN=true
```

---

## ✅ **IMPLEMENTATION PRIORITY ORDER**

### Phase 1: Core Real-Time (Week 1)
1. Update `src/services/websocketService.ts` - ✅ Already created
2. Update `src/lib/api.ts` - Add real-time endpoints
3. Update existing video components with Watch2Earn
4. Test WebSocket connections

### Phase 2: African Payments (Week 2)  
1. Update `src/services/africanPaymentService.ts` - Replace mock with real APIs
2. Create `src/config/africanServices.ts`
3. Update wallet/payment components
4. Test payment flows

### Phase 3: KYC Integration (Week 3)
1. Update `src/services/kycService.ts` - Add African providers
2. Create `src/services/africanKycService.ts`
3. Update KYC components
4. Test verification flows

### Phase 4: Crypto Trading (Week 4)
1. Update `src/services/cryptoService.ts` - Replace with real APIs
2. Update crypto components with real-time boards
3. Test trading functionality
4. Performance optimization

**Total Implementation Time: ~4 weeks with proper testing**

This mapping shows exactly which files exist, which need to be created, and where each API integration should go!
