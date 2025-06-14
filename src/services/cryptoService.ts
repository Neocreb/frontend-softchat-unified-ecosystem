import {
  Cryptocurrency,
  TradingPair,
  Portfolio,
  Transaction,
  MarketData,
  TradingSignal,
  News,
  EducationContent,
  DeFiProtocol,
  NFTCollection,
  StakingOption,
  Achievement,
  SocialTradingPost,
  ChartData,
  CopyTradingProvider,
} from "@/types/crypto";

// Mock data for realistic crypto experience
export const mockCryptocurrencies: Cryptocurrency[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250.67,
    market_cap: 846750000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 908500000000,
    total_volume: 18500000000,
    high_24h: 43890.12,
    low_24h: 42180.45,
    price_change_24h: 1070.22,
    price_change_percentage_24h: 2.54,
    price_change_percentage_7d_in_currency: 8.42,
    price_change_percentage_30d_in_currency: 15.67,
    market_cap_change_24h: 21600000000,
    market_cap_change_percentage_24h: 2.61,
    circulating_supply: 19590000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045.0,
    ath_change_percentage: -37.35,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 63654.78,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [40123, 40567, 41234, 42100, 42890, 43250, 43567],
    },
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2587.34,
    market_cap: 310950000000,
    market_cap_rank: 2,
    fully_diluted_valuation: null,
    total_volume: 12400000000,
    high_24h: 2612.89,
    low_24h: 2534.12,
    price_change_24h: 53.22,
    price_change_percentage_24h: 2.1,
    price_change_percentage_7d_in_currency: 6.78,
    price_change_percentage_30d_in_currency: 12.34,
    market_cap_change_24h: 6400000000,
    market_cap_change_percentage_24h: 2.1,
    circulating_supply: 120280000,
    total_supply: 120280000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -46.95,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 597142.1,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 97.34,
      currency: "usd",
      percentage: 9734.21,
    },
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [2456, 2489, 2512, 2545, 2567, 2587, 2590],
    },
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 312.45,
    market_cap: 46890000000,
    market_cap_rank: 3,
    fully_diluted_valuation: 46890000000,
    total_volume: 1890000000,
    high_24h: 318.67,
    low_24h: 308.12,
    price_change_24h: 4.33,
    price_change_percentage_24h: 1.41,
    price_change_percentage_7d_in_currency: 3.45,
    price_change_percentage_30d_in_currency: 8.92,
    market_cap_change_24h: 650000000,
    market_cap_change_percentage_24h: 1.41,
    circulating_supply: 150030000,
    total_supply: 150030000,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -54.45,
    ath_date: "2021-05-10T07:24:17.097Z",
    atl: 0.0398177,
    atl_change_percentage: 784145.2,
    atl_date: "2017-10-19T00:00:00.000Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [301, 305, 309, 312, 315, 312, 314],
    },
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.52,
    market_cap: 18420000000,
    market_cap_rank: 4,
    fully_diluted_valuation: 23400000000,
    total_volume: 890000000,
    high_24h: 0.538,
    low_24h: 0.501,
    price_change_24h: 0.018,
    price_change_percentage_24h: 3.59,
    price_change_percentage_7d_in_currency: 7.23,
    price_change_percentage_30d_in_currency: 14.67,
    market_cap_change_24h: 640000000,
    market_cap_change_percentage_24h: 3.59,
    circulating_supply: 35410000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -83.17,
    ath_date: "2021-09-02T06:00:10.474Z",
    atl: 0.01925275,
    atl_change_percentage: 2601.77,
    atl_date: "2020-03-13T02:22:55.391Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [0.485, 0.492, 0.501, 0.515, 0.523, 0.52, 0.525],
    },
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 98.45,
    market_cap: 42890000000,
    market_cap_rank: 5,
    fully_diluted_valuation: 55670000000,
    total_volume: 2340000000,
    high_24h: 102.34,
    low_24h: 96.12,
    price_change_24h: 2.33,
    price_change_percentage_24h: 2.42,
    price_change_percentage_7d_in_currency: 9.67,
    price_change_percentage_30d_in_currency: 18.94,
    market_cap_change_24h: 1020000000,
    market_cap_change_percentage_24h: 2.42,
    circulating_supply: 435670000,
    total_supply: 565450000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -62.12,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 19556.89,
    atl_date: "2020-05-11T19:35:23.449Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [89.45, 91.23, 94.67, 96.12, 98.45, 100.23, 99.78],
    },
  },
];

export const mockTradingPairs: TradingPair[] = [
  {
    id: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    price: 43250.67,
    change24h: 2.54,
    volume24h: 1850000000,
    high24h: 43890.12,
    low24h: 42180.45,
  },
  {
    id: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    price: 2587.34,
    change24h: 2.1,
    volume24h: 1240000000,
    high24h: 2612.89,
    low24h: 2534.12,
  },
  {
    id: "BNB/USDT",
    baseAsset: "BNB",
    quoteAsset: "USDT",
    price: 312.45,
    change24h: 1.41,
    volume24h: 189000000,
    high24h: 318.67,
    low24h: 308.12,
  },
  {
    id: "ADA/USDT",
    baseAsset: "ADA",
    quoteAsset: "USDT",
    price: 0.52,
    change24h: 3.59,
    volume24h: 89000000,
    high24h: 0.538,
    low24h: 0.501,
  },
  {
    id: "SOL/USDT",
    baseAsset: "SOL",
    quoteAsset: "USDT",
    price: 98.45,
    change24h: 2.42,
    volume24h: 234000000,
    high24h: 102.34,
    low24h: 96.12,
  },
];

export const mockPortfolio: Portfolio = {
  totalValue: 125670.45,
  totalChange24h: 3240.78,
  totalChangePercent24h: 2.64,
  assets: [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      amount: 2.5,
      value: 108126.68,
      change24h: 2675.55,
      changePercent24h: 2.54,
      allocation: 86.1,
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      amount: 6.8,
      value: 17593.51,
      change24h: 361.9,
      changePercent24h: 2.1,
      allocation: 14.0,
    },
  ],
};

export const mockStakingOptions: StakingOption[] = [
  {
    id: "eth-staking-1",
    asset: "ETH",
    type: "FLEXIBLE",
    apy: 4.5,
    minAmount: 0.1,
    rewardAsset: "ETH",
    isActive: true,
    totalStaked: 15678.45,
    description: "Ethereum 2.0 staking with flexible withdrawals",
    risks: ["Slashing risk", "Market volatility"],
    features: ["Flexible withdrawal", "Daily rewards", "Auto-compounding"],
  },
  {
    id: "bnb-staking-1",
    asset: "BNB",
    type: "LOCKED",
    apy: 8.2,
    minAmount: 1,
    duration: 30,
    rewardAsset: "BNB",
    isActive: true,
    totalStaked: 98765.32,
    description: "30-day locked BNB staking with higher rewards",
    risks: ["Lock-up period", "Market volatility"],
    features: ["High APY", "Auto-renewal option", "Early withdrawal penalty"],
  },
];

export const mockNews: News[] = [
  {
    id: "news-1",
    title: "Bitcoin Reaches New All-Time High Above $43,000",
    summary:
      "Bitcoin surges to new heights as institutional adoption continues to grow across major financial institutions worldwide.",
    author: "CryptoNews Team",
    source: "CryptoDaily",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=500",
    tags: ["Bitcoin", "ATH", "Institutional"],
    sentiment: "POSITIVE",
    publishedAt: "2024-01-15T14:30:00Z",
    relatedAssets: ["BTC"],
  },
  {
    id: "news-2",
    title: "Ethereum Layer 2 Solutions See Massive Growth",
    summary:
      "Layer 2 scaling solutions for Ethereum are experiencing unprecedented adoption as transaction costs continue to decrease.",
    author: "DeFi Analyst",
    source: "BlockchainWeekly",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
    tags: ["Ethereum", "Layer2", "Scaling"],
    sentiment: "POSITIVE",
    publishedAt: "2024-01-15T12:00:00Z",
    relatedAssets: ["ETH"],
  },
  {
    id: "news-3",
    title: "Solana Network Processes Record Transaction Volume",
    summary:
      "The Solana blockchain has achieved a new milestone with over 3,000 TPS sustained throughout the day.",
    author: "Blockchain Reporter",
    source: "SolanaNews",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=500",
    tags: ["Solana", "Performance", "TPS"],
    sentiment: "POSITIVE",
    publishedAt: "2024-01-15T10:15:00Z",
    relatedAssets: ["SOL"],
  },
];

export const mockEducationContent: EducationContent[] = [
  {
    id: "edu-1",
    title: "Introduction to Cryptocurrency Trading",
    description:
      "Learn the basics of crypto trading, from market analysis to risk management strategies.",
    content:
      "Complete course content covering fundamentals of cryptocurrency trading...",
    type: "COURSE",
    level: "BEGINNER",
    category: "Trading",
    tags: ["basics", "trading", "cryptocurrency"],
    duration: 45,
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300",
    author: "Trading Academy",
    rating: 4.8,
    views: 12567,
    likes: 1234,
    isBookmarked: false,
    progress: 0,
    publishedAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "edu-2",
    title: "Understanding DeFi Protocols",
    description:
      "Deep dive into decentralized finance protocols and how they work.",
    content: "Comprehensive guide to DeFi protocols...",
    type: "ARTICLE",
    level: "INTERMEDIATE",
    category: "DeFi",
    tags: ["defi", "protocols", "yield"],
    duration: 25,
    thumbnail:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300",
    author: "DeFi Expert",
    rating: 4.6,
    views: 8934,
    likes: 567,
    isBookmarked: false,
    progress: 0,
    publishedAt: "2024-01-08T15:30:00Z",
    updatedAt: "2024-01-08T15:30:00Z",
  },
];

// Mock order book data
const generateOrderBook = () => ({
  bids: Array.from({ length: 10 }, (_, i) => ({
    price: 43200 - i * 10,
    amount: Math.random() * 5,
    total: 0,
  })),
  asks: Array.from({ length: 10 }, (_, i) => ({
    price: 43260 + i * 10,
    amount: Math.random() * 5,
    total: 0,
  })),
});

// Mock recent trades
const generateRecentTrades = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `trade-${i}`,
    price: 43200 + (Math.random() - 0.5) * 100,
    amount: Math.random() * 2,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    side: Math.random() > 0.5 ? "buy" : "sell",
  }));

// Simplified service class with only mock data
export class CryptoService {
  // Add realistic delays to simulate loading
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Simulate price fluctuations for real-time feel
  private simulateRealTimePrices(cryptos: Cryptocurrency[]): Cryptocurrency[] {
    return cryptos.map((crypto) => {
      // Add small random price fluctuations (±2%)
      const priceChange = (Math.random() - 0.5) * 0.04;
      const newPrice = crypto.current_price * (1 + priceChange);
      const price_change_24h = newPrice - crypto.current_price;
      const price_change_percentage_24h =
        (price_change_24h / crypto.current_price) * 100;

      return {
        ...crypto,
        current_price: parseFloat(newPrice.toFixed(8)),
        price_change_24h: parseFloat(price_change_24h.toFixed(8)),
        price_change_percentage_24h: parseFloat(
          price_change_percentage_24h.toFixed(2),
        ),
        high_24h: Math.max(crypto.high_24h, newPrice),
        low_24h: Math.min(crypto.low_24h, newPrice),
        last_updated: new Date().toISOString(),
      };
    });
  }

  async getCryptocurrencies(
    limit = 100,
    sortBy = "market_cap_desc",
  ): Promise<Cryptocurrency[]> {
    await this.delay(200); // Simulate network delay
    console.log("📊 CryptoService: Returning simulated cryptocurrency data");

    const data = mockCryptocurrencies.slice(
      0,
      Math.min(limit, mockCryptocurrencies.length),
    );
    return this.simulateRealTimePrices(data);
  }

  async getMarketData(): Promise<MarketData> {
    await this.delay(300);
    console.log("📊 CryptoService: Returning simulated market data");

    const cryptos = this.simulateRealTimePrices(mockCryptocurrencies);

    return {
      globalStats: {
        totalMarketCap: 1750000000000 * (0.98 + Math.random() * 0.04), // ±2% variation
        totalVolume24h: 85000000000 * (0.9 + Math.random() * 0.2), // ±10% variation
        marketCapChange24h: (Math.random() - 0.5) * 10, // ±5% change
        btcDominance: 48.5 + (Math.random() - 0.5) * 2, // ±1% variation
        ethDominance: 18.2 + (Math.random() - 0.5) * 2, // ±1% variation
        activeCoins: 8924,
        markets: 25687,
      },
      topMovers: {
        gainers: cryptos
          .filter((c) => c.price_change_percentage_24h > 0)
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h,
          )
          .slice(0, 5),
        losers: cryptos
          .filter((c) => c.price_change_percentage_24h < 0)
          .sort(
            (a, b) =>
              a.price_change_percentage_24h - b.price_change_percentage_24h,
          )
          .slice(0, 5),
      },
      trending: cryptos.slice(0, 5),
      fearGreedIndex: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString(),
    };
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    await this.delay(150);
    return mockTradingPairs;
  }

  async getPortfolio(): Promise<Portfolio> {
    await this.delay(250);
    return mockPortfolio;
  }

  async getStakingOptions(): Promise<StakingOption[]> {
    await this.delay(200);
    return mockStakingOptions;
  }

  async getCryptocurrencyById(id: string): Promise<Cryptocurrency | null> {
    await this.delay(100);
    const crypto = mockCryptocurrencies.find((c) => c.id === id);
    if (!crypto) return null;

    // Return with simulated price updates
    return this.simulateRealTimePrices([crypto])[0];
  }

  async getNews(limit = 10): Promise<News[]> {
    await this.delay(300);
    return mockNews.slice(0, limit);
  }

  async getEducationContent(limit = 10): Promise<EducationContent[]> {
    await this.delay(250);
    return mockEducationContent.slice(0, limit);
  }

  async getOrderBook(pair: string) {
    await this.delay(100);
    return generateOrderBook();
  }

  async getRecentTrades(pair: string, limit = 20) {
    await this.delay(100);
    return generateRecentTrades(limit);
  }

  // Chart data for trading interface
  async getChartData(pair: string, interval: string): Promise<ChartData[]> {
    await this.delay(200);

    // Generate realistic OHLCV data
    const now = Date.now();
    const intervalMs = 60000; // 1 minute intervals

    return Array.from({ length: 100 }, (_, i) => {
      const timestamp = now - (100 - i) * intervalMs;
      const basePrice = 43200 + Math.sin(i / 10) * 500; // Base wave pattern
      const volatility = 100; // Price volatility

      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility * 0.5;
      const high = Math.max(open, close) + Math.random() * volatility * 0.3;
      const low = Math.min(open, close) - Math.random() * volatility * 0.3;
      const volume = Math.random() * 1000000;

      return {
        timestamp,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(2)),
      };
    });
  }
}

// Export singleton instance
export const cryptoService = new CryptoService();

// Status functions (now always return "healthy" since we're using mock data)
export const getApiStatus = () => ({
  failureCount: 0,
  isDisabled: false,
  maxFailures: 0,
  lastAttempt: Date.now(),
  nextRetry: 0,
});

export const resetApiStatus = () => {
  console.log("📊 CryptoService: Using mock data only - no API to reset");
};
