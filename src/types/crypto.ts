// Enhanced crypto types for comprehensive trading platform

export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  image: string;
  sparkline_in_7d?: number[];
  last_updated: string;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  quoteVolume: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  lastUpdateId: number;
  lastUpdated: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId: number;
  timestamp: string;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  quoteQuantity: number;
  time: string;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface Order {
  id: string;
  clientOrderId?: string;
  symbol: string;
  side: "BUY" | "SELL";
  type:
    | "MARKET"
    | "LIMIT"
    | "STOP_LOSS"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_LIMIT";
  timeInForce?: "GTC" | "IOC" | "FOK";
  quantity: number;
  price?: number;
  stopPrice?: number;
  icebergQty?: number;
  originalQuantity: number;
  executedQuantity: number;
  cummulativeQuoteQty: number;
  status:
    | "NEW"
    | "PARTIALLY_FILLED"
    | "FILLED"
    | "CANCELED"
    | "PENDING_CANCEL"
    | "REJECTED"
    | "EXPIRED";
  fills: OrderFill[];
  timestamp: string;
  updateTime: string;
}

export interface OrderFill {
  price: number;
  quantity: number;
  commission: number;
  commissionAsset: string;
  tradeId: string;
}

export interface Portfolio {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  assets: PortfolioAsset[];
  allocation: AssetAllocation[];
}

export interface PortfolioAsset {
  asset: string;
  free: number;
  locked: number;
  total: number;
  btcValue: number;
  usdValue: number;
  price: number;
  change24h: number;
  changePercent24h: number;
  allocation: number;
}

export interface AssetAllocation {
  asset: string;
  percentage: number;
  value: number;
  color: string;
}

export interface Transaction {
  id: string;
  type:
    | "DEPOSIT"
    | "WITHDRAW"
    | "TRADE"
    | "TRANSFER"
    | "STAKING"
    | "REWARD"
    | "FEE";
  asset: string;
  amount: number;
  fee?: number;
  feeAsset?: string;
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";
  txHash?: string;
  address?: string;
  tag?: string;
  network?: string;
  timestamp: string;
  updatedAt: string;
}

export interface P2POffer {
  id: string;
  userId: string;
  type: "BUY" | "SELL";
  asset: string;
  fiatCurrency: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  totalAmount: number;
  availableAmount: number;
  paymentMethods: PaymentMethod[];
  terms?: string;
  autoReply?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  user: UserProfile;
  completionRate: number;
  avgReleaseTime: number;
  totalTrades: number;
  createdAt: string;
  updatedAt: string;
}

export interface P2PTrade {
  id: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  asset: string;
  fiatCurrency: string;
  amount: number;
  price: number;
  totalPrice: number;
  paymentMethod: string;
  status:
    | "PENDING"
    | "PAID"
    | "RELEASED"
    | "CANCELLED"
    | "DISPUTED"
    | "COMPLETED";
  messages: P2PMessage[];
  evidence?: P2PEvidence[];
  buyer: UserProfile;
  seller: UserProfile;
  timeRemaining?: number;
  autoReleaseTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface P2PMessage {
  id: string;
  senderId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "SYSTEM";
  timestamp: string;
}

export interface P2PEvidence {
  id: string;
  type: "IMAGE" | "DOCUMENT" | "SCREENSHOT";
  url: string;
  description?: string;
  uploadedBy: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  kycLevel: number;
  rating: number;
  totalTrades: number;
  completionRate: number;
  avgReleaseTime: number;
  firstTradeDate?: string;
  languages?: string[];
  timezone?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "BANK_TRANSFER" | "DIGITAL_WALLET" | "CASH" | "GIFT_CARD" | "OTHER";
  icon?: string;
  processingTime: string;
  fees?: string;
  limits?: {
    min: number;
    max: number;
    daily?: number;
    monthly?: number;
  };
  isActive: boolean;
}

export interface StakingProduct {
  id: string;
  asset: string;
  type: "FLEXIBLE" | "LOCKED";
  apy: number;
  minAmount: number;
  maxAmount?: number;
  duration?: number; // in days
  rewardAsset: string;
  isActive: boolean;
  totalStaked: number;
  description: string;
  risks: string[];
  features: string[];
}

export interface StakingPosition {
  id: string;
  productId: string;
  asset: string;
  amount: number;
  rewardAsset: string;
  apy: number;
  dailyReward: number;
  totalRewards: number;
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "REDEEMED" | "PENDING";
  autoRenew: boolean;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: "LENDING" | "BORROWING" | "LP" | "FARMING" | "VAULT";
  asset: string;
  amount: number;
  apy: number;
  rewards: DeFiReward[];
  value: number;
  healthFactor?: number;
  collateralRatio?: number;
  liquidationPrice?: number;
  startDate: string;
  status: "ACTIVE" | "CLOSED" | "LIQUIDATED";
}

export interface DeFiReward {
  asset: string;
  amount: number;
  apy: number;
  value: number;
}

export interface LaunchpadProject {
  id: string;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  website?: string;
  whitepaper?: string;
  totalSupply: number;
  tokenPrice: number;
  allocationPerUser: number;
  minCommitment: number;
  maxCommitment: number;
  totalCommitted: number;
  hardCap: number;
  startDate: string;
  endDate: string;
  listingDate: string;
  status: "UPCOMING" | "ACTIVE" | "ENDED" | "LISTED";
  requirements: {
    minBalance?: number;
    kycRequired: boolean;
    holding?: {
      asset: string;
      amount: number;
      days: number;
    };
  };
  tokenomics: {
    publicSale: number;
    team: number;
    marketing: number;
    development: number;
    liquidity: number;
    ecosystem: number;
  };
}

export interface LaunchpadCommitment {
  id: string;
  projectId: string;
  userId: string;
  amount: number;
  timestamp: string;
  status: "PENDING" | "CONFIRMED" | "REFUNDED";
}

export interface MarketData {
  globalStats: {
    totalMarketCap: number;
    totalVolume24h: number;
    marketCapChange24h: number;
    btcDominance: number;
    ethDominance: number;
    activeCoins: number;
    markets: number;
  };
  topMovers: {
    gainers: Cryptocurrency[];
    losers: Cryptocurrency[];
  };
  fearGreedIndex: {
    value: number;
    classification: string;
    timestamp: string;
  };
  trending: Cryptocurrency[];
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content?: string;
  author: string;
  source: string;
  url?: string;
  image?: string;
  tags: string[];
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  publishedAt: string;
  relatedAssets?: string[];
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: "BUY" | "SELL" | "NEUTRAL";
  timeframe: string;
}

export interface ChartData {
  symbol: string;
  timeframe: string;
  data: CandlestickData[];
  volume: VolumeData[];
  indicators?: {
    [key: string]: number[];
  };
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  timestamp: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
}

export interface Alert {
  id: string;
  type: "PRICE" | "VOLUME" | "MARKET_CAP" | "NEWS" | "TECHNICAL";
  asset: string;
  condition: "ABOVE" | "BELOW" | "CROSSES_UP" | "CROSSES_DOWN";
  value: number;
  currentValue?: number;
  message: string;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface WatchlistItem {
  id: string;
  asset: string;
  addedAt: string;
  alerts: Alert[];
  notes?: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "DCA" | "GRID" | "REBALANCE" | "MOMENTUM" | "MEAN_REVERSION";
  assets: string[];
  parameters: {
    [key: string]: any;
  };
  isActive: boolean;
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  createdAt: string;
  lastExecuted?: string;
}

export interface CopyTradingProvider {
  id: string;
  username: string;
  avatar?: string;
  description: string;
  verified: boolean;
  rating: number;
  followers: number;
  copiers: number;
  aum: number; // Assets under management
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  assets: string[];
  riskScore: number;
  minCopyAmount: number;
  fees: {
    management: number;
    performance: number;
  };
  isOpen: boolean;
}

export interface CopyTradingPosition {
  id: string;
  providerId: string;
  followerBalance: number;
  copyRatio: number;
  startDate: string;
  totalPnl: number;
  totalPnlPercent: number;
  monthlyPnl: number;
  monthlyPnlPercent: number;
  isActive: boolean;
}

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "ARTICLE" | "VIDEO" | "COURSE" | "QUIZ" | "WEBINAR";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: string;
  tags: string[];
  duration?: number; // in minutes
  thumbnail?: string;
  videoUrl?: string;
  author: string;
  rating: number;
  views: number;
  likes: number;
  isBookmarked: boolean;
  progress?: number; // for courses/videos
  publishedAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
  maxAttempts: number;
  reward?: {
    type: "POINTS" | "CRYPTO" | "BADGE";
    amount: number;
    asset?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  reward?: {
    type: "POINTS" | "CRYPTO" | "DISCOUNT";
    amount: number;
    asset?: string;
  };
}

export interface SocialTradingPost {
  id: string;
  userId: string;
  user: UserProfile;
  type: "TRADE" | "ANALYSIS" | "NEWS" | "DISCUSSION";
  content: string;
  images?: string[];
  trades?: {
    symbol: string;
    side: "BUY" | "SELL";
    price: number;
    quantity: number;
    pnl?: number;
    pnlPercent?: number;
  }[];
  predictions?: {
    asset: string;
    direction: "UP" | "DOWN";
    targetPrice: number;
    timeframe: string;
    confidence: number;
  }[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowing: boolean;
  tags: string[];
  timestamp: string;
}

export interface CryptoContextType {
  // Market data
  cryptocurrencies: Cryptocurrency[];
  tradingPairs: TradingPair[];
  marketData: MarketData | null;
  selectedPair: string;

  // Trading
  orderBook: OrderBook | null;
  recentTrades: Trade[];
  openOrders: Order[];
  orderHistory: Order[];
  portfolio: Portfolio | null;

  // P2P
  p2pOffers: P2POffer[];
  p2pTrades: P2PTrade[];

  // DeFi
  stakingProducts: StakingProduct[];
  stakingPositions: StakingPosition[];
  defiPositions: DeFiPosition[];

  // Other features
  watchlist: WatchlistItem[];
  alerts: Alert[];
  news: News[];
  transactions: Transaction[];

  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedPair: (pair: string) => void;
  fetchMarketData: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  placeOrder: (
    order: Omit<Order, "id" | "timestamp" | "updateTime" | "fills">,
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  addToWatchlist: (asset: string) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  createAlert: (
    alert: Omit<Alert, "id" | "createdAt" | "isTriggered" | "triggeredAt">,
  ) => Promise<void>;
  fetchP2POffers: (filters?: any) => Promise<void>;
  createP2POffer: (
    offer: Omit<P2POffer, "id" | "userId" | "user" | "createdAt" | "updatedAt">,
  ) => Promise<void>;

  // Real-time updates
  subscribeToTrades: (symbol: string) => () => void;
  subscribeToOrderBook: (symbol: string) => () => void;
  subscribeToTicker: (symbol: string) => () => void;
}
