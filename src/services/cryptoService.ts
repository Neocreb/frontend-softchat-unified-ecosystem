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

// CoinGecko API configuration
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const BACKUP_API_BASE = "https://api.coinlore.net/api";

// Rate limiting and caching
const API_CACHE = new Map();
const CACHE_DURATION = 30000; // 30 seconds
const REQUEST_DELAY = 100; // 100ms between requests to avoid rate limiting

// API failure tracking with automatic recovery
let apiFailureCount = 0;
const MAX_API_FAILURES = 5; // Increased tolerance
let apiDisabled = false;
let lastApiAttempt = 0;
const API_RETRY_INTERVAL = 60000; // Retry every minute

// Function to reset API status (useful for testing or manual recovery)
export const resetApiStatus = () => {
  apiFailureCount = 0;
  apiDisabled = false;
  lastApiAttempt = 0;
  console.log("📊 CryptoService: API status reset - real API calls re-enabled");
};

// Function to get current API status
export const getApiStatus = () => ({
  failureCount: apiFailureCount,
  isDisabled: apiDisabled,
  maxFailures: MAX_API_FAILURES,
  lastAttempt: lastApiAttempt,
  nextRetry: lastApiAttempt + API_RETRY_INTERVAL,
});

// Helper function to make API requests with improved error handling
const fetchWithCache = async (url: string, cacheKey: string) => {
  // Auto-recovery: try to re-enable API after interval
  if (apiDisabled && Date.now() - lastApiAttempt > API_RETRY_INTERVAL) {
    console.log("📊 CryptoService: Attempting API recovery...");
    apiDisabled = false;
    apiFailureCount = Math.max(0, apiFailureCount - 1); // Reduce failure count
  }

  // If API is disabled due to repeated failures, return null immediately
  if (apiDisabled) {
    console.log(
      "📊 CryptoService: Using simulated data (API temporarily unavailable)",
    );
    return null;
  }

  // Check cache first
  const cached = API_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Add delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));

    lastApiAttempt = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "SoftChat/1.0",
      },
      mode: "cors",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Reset failure count on successful request
    if (apiFailureCount > 0) {
      console.log("📊 CryptoService: API connection restored");
      apiFailureCount = 0;
    }

    // Cache the result
    API_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.log(
      `🌐 CryptoService: API request failed for ${url}:`,
      error.message,
    );

    // Increment failure count
    apiFailureCount++;

    // Disable API if too many failures
    if (apiFailureCount >= MAX_API_FAILURES) {
      apiDisabled = true;
      console.warn(
        `🚨 CryptoService: API disabled after ${MAX_API_FAILURES} failures. Using simulation mode. Will retry in ${API_RETRY_INTERVAL / 1000}s.`,
      );
    }

    // Return cached data if available, even if expired
    if (cached) {
      console.log("📋 CryptoService: Using cached data due to API failure");
      return cached.data;
    }

    // Return null to trigger fallback
    return null;
  }
};

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Transform CoinGecko API data to our format
const transformCoinGeckoData = (data: any[]): Cryptocurrency[] => {
  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price || 0,
    market_cap: coin.market_cap || 0,
    market_cap_rank: coin.market_cap_rank || 999,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    total_volume: coin.total_volume || 0,
    high_24h: coin.high_24h || coin.current_price || 0,
    low_24h: coin.low_24h || coin.current_price || 0,
    price_change_24h: coin.price_change_24h || 0,
    price_change_percentage_24h: coin.price_change_percentage_24h || 0,
    price_change_percentage_7d_in_currency:
      coin.price_change_percentage_7d_in_currency || 0,
    price_change_percentage_30d_in_currency:
      coin.price_change_percentage_30d_in_currency || 0,
    market_cap_change_24h: coin.market_cap_change_24h || 0,
    market_cap_change_percentage_24h:
      coin.market_cap_change_percentage_24h || 0,
    circulating_supply: coin.circulating_supply || 0,
    total_supply: coin.total_supply,
    max_supply: coin.max_supply,
    ath: coin.ath || coin.current_price || 0,
    ath_change_percentage: coin.ath_change_percentage || 0,
    ath_date: coin.ath_date || new Date().toISOString(),
    atl: coin.atl || coin.current_price || 0,
    atl_change_percentage: coin.atl_change_percentage || 0,
    atl_date: coin.atl_date || new Date().toISOString(),
    roi: coin.roi,
    last_updated: coin.last_updated || new Date().toISOString(),
    sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
  }));
};

// Mock data for fallback
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
      "Bitcoin surges to new heights as institutional adoption continues to grow.",
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
      "Layer 2 scaling solutions for Ethereum are experiencing unprecedented adoption.",
    author: "DeFi Analyst",
    source: "BlockchainWeekly",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
    tags: ["Ethereum", "Layer2", "Scaling"],
    sentiment: "POSITIVE",
    publishedAt: "2024-01-15T12:00:00Z",
    relatedAssets: ["ETH"],
  },
];

export const mockEducationContent: EducationContent[] = [
  {
    id: "edu-1",
    title: "Introduction to Cryptocurrency Trading",
    description:
      "Learn the basics of crypto trading, from market analysis to risk management.",
    content: "Complete course content here...",
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
];

// Service class
export class CryptoService {
  // Market data with improved error handling
  async getCryptocurrencies(
    limit = 100,
    sortBy = "market_cap_desc",
  ): Promise<Cryptocurrency[]> {
    try {
      const cacheKey = `cryptocurrencies_${limit}_${sortBy}`;

      // Try CoinGecko API first
      const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${Math.min(limit, 250)}&page=1&sparkline=true&price_change_percentage=7d,30d&locale=en`;

      const data = await fetchWithCache(url, cacheKey);

      // If API returned valid data, transform and return it
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("📊 CryptoService: Using live market data");
        return transformCoinGeckoData(data);
      }

      // If API failed or returned invalid data, use fallback
      console.log("📊 CryptoService: Using simulated market data");
      return this.getFallbackCryptocurrencies(limit);
    } catch (error) {
      console.log(
        "📊 CryptoService: Error in getCryptocurrencies:",
        error.message,
      );
      return this.getFallbackCryptocurrencies(limit);
    }
  }

  // Fallback method that returns mock data with realistic variations
  private getFallbackCryptocurrencies(limit: number): Cryptocurrency[] {
    const mockData = mockCryptocurrencies.slice(
      0,
      Math.min(limit, mockCryptocurrencies.length),
    );
    return this.simulateRealTimePrices(mockData);
  }

  // Simulate real-time price changes for fallback data
  private simulateRealTimePrices(cryptos: Cryptocurrency[]): Cryptocurrency[] {
    return cryptos.map((crypto) => {
      // Add small random price fluctuations (±3%)
      const priceChange = (Math.random() - 0.5) * 0.06;
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

  async getTradingPairs(): Promise<TradingPair[]> {
    await delay(300);
    return mockTradingPairs;
  }

  async getMarketData(): Promise<MarketData> {
    try {
      // Get global market data from CoinGecko
      const globalUrl = `${COINGECKO_API_BASE}/global`;
      const globalData = await fetchWithCache(globalUrl, "global_market_data");

      // Get trending coins for top movers
      const trendingUrl = `${COINGECKO_API_BASE}/search/trending`;
      const trendingData = await fetchWithCache(trendingUrl, "trending_coins");

      // Get current top cryptocurrencies for gainers/losers
      const topCryptos = await this.getCryptocurrencies(50);

      // Check if we got valid global data
      if (globalData && globalData.data) {
        const global = globalData.data;
        console.log("📊 CryptoService: Using live global market data");

        return {
          globalStats: {
            totalMarketCap: global.total_market_cap?.usd || 1750000000000,
            totalVolume24h: global.total_volume?.usd || 85000000000,
            marketCapChange24h:
              global.market_cap_change_percentage_24h_usd || 0,
            btcDominance: global.market_cap_percentage?.btc || 48.5,
            ethDominance: global.market_cap_percentage?.eth || 18.2,
            activeCoins: global.active_cryptocurrencies || 8924,
            markets: global.markets || 25687,
          },
          topMovers: {
            gainers: topCryptos
              .filter((c) => c.price_change_percentage_24h > 0)
              .sort(
                (a, b) =>
                  b.price_change_percentage_24h - a.price_change_percentage_24h,
              )
              .slice(0, 5),
            losers: topCryptos
              .filter((c) => c.price_change_percentage_24h < 0)
              .sort(
                (a, b) =>
                  a.price_change_percentage_24h - b.price_change_percentage_24h,
              )
              .slice(0, 5),
          },
          trending:
            trendingData?.coins?.slice(0, 5).map((coin: any) => ({
              id: coin.item.id,
              name: coin.item.name,
              symbol: coin.item.symbol,
              current_price: 0, // Trending API doesn't include price
              market_cap_rank: coin.item.market_cap_rank,
              image: coin.item.thumb,
              price_change_percentage_24h: 0,
            })) || topCryptos.slice(10, 15),
          fearGreedIndex: Math.floor(Math.random() * 100), // Fear & Greed Index not available in free API
          lastUpdated: new Date().toISOString(),
        };
      }

      // If no valid data, use fallback
      return this.getFallbackMarketData(topCryptos);
    } catch (error) {
      console.log("📊 CryptoService: Error in getMarketData:", error.message);
      // Always return fallback data instead of throwing
      const fallbackCryptos = this.getFallbackCryptocurrencies(50);
      return this.getFallbackMarketData(fallbackCryptos);
    }
  }

  // Fallback market data with realistic simulated values
  private getFallbackMarketData(cryptos: Cryptocurrency[]): MarketData {
    console.log("📊 CryptoService: Using simulated global market data");

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

  async getPortfolio(): Promise<Portfolio> {
    await delay(500);
    return mockPortfolio;
  }

  async getStakingOptions(): Promise<StakingOption[]> {
    await delay(300);
    return mockStakingOptions;
  }

  async getCryptocurrencyById(id: string): Promise<Cryptocurrency | null> {
    await delay(200);
    return mockCryptocurrencies.find((crypto) => crypto.id === id) || null;
  }

  async getNews(limit = 10): Promise<News[]> {
    await delay(400);
    return mockNews.slice(0, limit);
  }

  async getEducationContent(limit = 10): Promise<EducationContent[]> {
    await delay(300);
    return mockEducationContent.slice(0, limit);
  }

  // Add delay helper method
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const cryptoService = new CryptoService();

// Export API status functions for monitoring
export { getApiStatus, resetApiStatus };
