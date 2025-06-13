import {
  Cryptocurrency,
  TradingPair,
  OrderBook,
  Trade,
  Order,
  Portfolio,
  P2POffer,
  P2PTrade,
  StakingProduct,
  StakingPosition,
  DeFiPosition,
  LaunchpadProject,
  MarketData,
  News,
  Alert,
  WatchlistItem,
  Transaction,
  EducationContent,
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

// Helper function to make API requests with caching and rate limiting
const fetchWithCache = async (url: string, cacheKey: string) => {
  // Check cache first
  const cached = API_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Add delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    API_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.log(`API request failed for ${url}:`, error.message);

    // Return cached data if available, even if expired
    if (cached) {
      console.log("Using cached data due to API failure");
      return cached.data;
    }

    // Don't throw error to prevent cascading failures
    return null;
  }
};

// Transform CoinGecko data to our format
const transformCoinGeckoData = (coinGeckoData: any[]): Cryptocurrency[] => {
  return coinGeckoData.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.current_price || 0,
    market_cap: coin.market_cap || 0,
    market_cap_rank: coin.market_cap_rank || 0,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    total_volume: coin.total_volume || 0,
    high_24h: coin.high_24h || coin.current_price,
    low_24h: coin.low_24h || coin.current_price,
    price_change_24h: coin.price_change_24h || 0,
    price_change_percentage_24h: coin.price_change_percentage_24h || 0,
    price_change_percentage_7d:
      coin.price_change_percentage_7d_in_currency || 0,
    price_change_percentage_30d:
      coin.price_change_percentage_30d_in_currency || 0,
    market_cap_change_24h: coin.market_cap_change_24h || 0,
    market_cap_change_percentage_24h:
      coin.market_cap_change_percentage_24h || 0,
    circulating_supply: coin.circulating_supply || 0,
    total_supply: coin.total_supply,
    max_supply: coin.max_supply,
    ath: coin.ath || coin.current_price,
    ath_change_percentage: coin.ath_change_percentage || 0,
    ath_date: coin.ath_date || new Date().toISOString(),
    atl: coin.atl || coin.current_price,
    atl_change_percentage: coin.atl_change_percentage || 0,
    atl_date: coin.atl_date || new Date().toISOString(),
    image:
      coin.image ||
      `https://via.placeholder.com/64x64/1f2937/ffffff?text=${coin.symbol?.toUpperCase()}`,
    sparkline_in_7d: coin.sparkline_in_7d?.price || [],
    last_updated: coin.last_updated || new Date().toISOString(),
  }));
};

// Mock data for development
export const mockCryptocurrencies: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 43250.5,
    market_cap: 846789123456,
    market_cap_rank: 1,
    total_volume: 25847123456,
    high_24h: 43950.75,
    low_24h: 42150.25,
    price_change_24h: 1234.25,
    price_change_percentage_24h: 2.94,
    price_change_percentage_7d: 8.45,
    price_change_percentage_30d: 15.32,
    market_cap_change_24h: 25847123456,
    market_cap_change_percentage_24h: 2.94,
    circulating_supply: 19578431,
    total_supply: 19578431,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -37.4,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 63653.2,
    atl_date: "2013-07-06T00:00:00.000Z",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    sparkline_in_7d: [41000, 41500, 42000, 42500, 43000, 43250],
    last_updated: new Date().toISOString(),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    current_price: 2645.89,
    market_cap: 318234567890,
    market_cap_rank: 2,
    total_volume: 15234567890,
    high_24h: 2689.45,
    low_24h: 2598.32,
    price_change_24h: -32.56,
    price_change_percentage_24h: -1.22,
    price_change_percentage_7d: 5.67,
    price_change_percentage_30d: 12.45,
    market_cap_change_24h: -3912345678,
    market_cap_change_percentage_24h: -1.22,
    circulating_supply: 120291451,
    total_supply: 120291451,
    ath: 4878.26,
    ath_change_percentage: -45.8,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 610942.1,
    atl_date: "2015-10-20T00:00:00.000Z",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    sparkline_in_7d: [2500, 2550, 2600, 2620, 2640, 2645],
    last_updated: new Date().toISOString(),
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    current_price: 98.45,
    market_cap: 42567890123,
    market_cap_rank: 5,
    total_volume: 2345678901,
    high_24h: 102.34,
    low_24h: 96.78,
    price_change_24h: 5.67,
    price_change_percentage_24h: 6.12,
    price_change_percentage_7d: 14.23,
    price_change_percentage_30d: 22.89,
    market_cap_change_24h: 2456789012,
    market_cap_change_percentage_24h: 6.12,
    circulating_supply: 432567890,
    total_supply: 567890123,
    ath: 259.96,
    ath_change_percentage: -62.1,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 19556.8,
    atl_date: "2020-05-11T19:35:23.449Z",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    sparkline_in_7d: [90, 92, 95, 97, 99, 98.45],
    last_updated: new Date().toISOString(),
  },
];

export const mockTradingPairs: TradingPair[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    price: 43250.5,
    priceChange: 1234.25,
    priceChangePercent: 2.94,
    volume: 12345.67,
    quoteVolume: 534567890.12,
    openPrice: 42016.25,
    highPrice: 43950.75,
    lowPrice: 42150.25,
    bidPrice: 43249.5,
    askPrice: 43251.5,
    spread: 2.0,
    lastUpdateId: 1234567890,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    price: 2645.89,
    priceChange: -32.56,
    priceChangePercent: -1.22,
    volume: 45678.9,
    quoteVolume: 120891234.56,
    openPrice: 2678.45,
    highPrice: 2689.45,
    lowPrice: 2598.32,
    bidPrice: 2645.0,
    askPrice: 2646.0,
    spread: 1.0,
    lastUpdateId: 1234567891,
    lastUpdated: new Date().toISOString(),
  },
];

export const mockP2POffers: P2POffer[] = [
  {
    id: "offer-1",
    userId: "user-1",
    type: "SELL",
    asset: "BTC",
    fiatCurrency: "USD",
    price: 43300,
    minAmount: 1000,
    maxAmount: 50000,
    totalAmount: 100000,
    availableAmount: 75000,
    paymentMethods: [
      {
        id: "bank-transfer",
        name: "Bank Transfer",
        type: "BANK_TRANSFER",
        processingTime: "15-30 minutes",
        isActive: true,
      },
    ],
    terms: "Fast and reliable trader. Payment within 15 minutes required.",
    status: "ACTIVE",
    user: {
      id: "user-1",
      username: "CryptoPro123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      isVerified: true,
      kycLevel: 3,
      rating: 4.9,
      totalTrades: 1247,
      completionRate: 99.2,
      avgReleaseTime: 12,
      isOnline: true,
      languages: ["EN", "ES"],
      timezone: "UTC-5",
    },
    completionRate: 99.2,
    avgReleaseTime: 12,
    totalTrades: 1247,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

export const mockStakingProducts: StakingProduct[] = [
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
  // Market data
  async getCryptocurrencies(
    limit = 100,
    sortBy = "market_cap_desc",
  ): Promise<Cryptocurrency[]> {
    try {
      const cacheKey = `cryptocurrencies_${limit}_${sortBy}`;

      // Try CoinGecko API first
      const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${Math.min(limit, 250)}&page=1&sparkline=true&price_change_percentage=7d,30d&locale=en`;

      const data = await fetchWithCache(url, cacheKey);
      return transformCoinGeckoData(data);
    } catch (error) {
      console.error("Failed to fetch real-time crypto data:", error);

      // Fallback to mock data with real-time price simulation
      const mockData = mockCryptocurrencies.slice(0, limit);
      return this.simulateRealTimePrices(mockData);
    }
  }

  // Simulate real-time price changes for fallback data
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

  async getTradingPairs(): Promise<TradingPair[]> {
    await this.delay(300);
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

      const global = globalData.data;

      return {
        globalStats: {
          totalMarketCap: global.total_market_cap?.usd || 1750000000000,
          totalVolume24h: global.total_volume?.usd || 85000000000,
          marketCapChange24h: global.market_cap_change_percentage_24h_usd || 0,
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
          trendingData.coins?.slice(0, 5).map((coin: any) => ({
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
    } catch (error) {
      console.error("Failed to fetch real-time market data:", error);

      // Fallback to mock data with simulated updates
      const fallbackCryptos = this.simulateRealTimePrices(mockCryptocurrencies);
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
          gainers: fallbackCryptos
            .filter((c) => c.price_change_percentage_24h > 0)
            .sort(
              (a, b) =>
                b.price_change_percentage_24h - a.price_change_percentage_24h,
            )
            .slice(0, 5),
          losers: fallbackCryptos
            .filter((c) => c.price_change_percentage_24h < 0)
            .sort(
              (a, b) =>
                a.price_change_percentage_24h - b.price_change_percentage_24h,
            )
            .slice(0, 5),
        },
        trending: fallbackCryptos.slice(10, 15),
        fearGreedIndex: 65,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // Real-time price updates for specific coins
  async getRealTimePrice(
    coinIds: string[],
  ): Promise<{ [key: string]: { usd: number; usd_24h_change: number } }> {
    if (!coinIds || coinIds.length === 0) {
      return {};
    }

    try {
      const ids = coinIds.join(",");
      const url = `${COINGECKO_API_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
      const cacheKey = `realtime_prices_${ids}`;

      const data = await fetchWithCache(url, cacheKey);

      // If API returned null (failed), use mock data
      if (!data) {
        throw new Error("API returned null");
      }

      return data;
    } catch (error) {
      console.log("Using simulated price data due to API unavailability");

      // Return mock data with simulated real-time changes
      const mockPrices: {
        [key: string]: { usd: number; usd_24h_change: number };
      } = {};
      coinIds.forEach((coinId) => {
        const basePrices: { [key: string]: number } = {
          bitcoin: 43250,
          ethereum: 2645,
          binancecoin: 315,
          solana: 98,
          cardano: 0.52,
          "avalanche-2": 38,
          polkadot: 7.2,
          chainlink: 14.8,
        };

        const basePrice = basePrices[coinId] || 100;
        const priceChange = (Math.random() - 0.5) * 0.04; // ±2%
        const newPrice = basePrice * (1 + priceChange);
        const change24h = (Math.random() - 0.5) * 10; // ±5%

        mockPrices[coinId] = {
          usd: parseFloat(newPrice.toFixed(8)),
          usd_24h_change: parseFloat(change24h.toFixed(2)),
        };
      });

      return mockPrices;
    }
  }

  // Get detailed coin information with real-time data
  async getCoinDetails(coinId: string): Promise<Cryptocurrency | null> {
    try {
      const url = `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;
      const cacheKey = `coin_details_${coinId}`;

      const data = await fetchWithCache(url, cacheKey);

      return {
        id: data.id,
        name: data.name,
        symbol: data.symbol,
        current_price: data.market_data?.current_price?.usd || 0,
        market_cap: data.market_data?.market_cap?.usd || 0,
        market_cap_rank: data.market_cap_rank || 0,
        fully_diluted_valuation: data.market_data?.fully_diluted_valuation?.usd,
        total_volume: data.market_data?.total_volume?.usd || 0,
        high_24h: data.market_data?.high_24h?.usd || 0,
        low_24h: data.market_data?.low_24h?.usd || 0,
        price_change_24h: data.market_data?.price_change_24h || 0,
        price_change_percentage_24h:
          data.market_data?.price_change_percentage_24h || 0,
        price_change_percentage_7d:
          data.market_data?.price_change_percentage_7d || 0,
        price_change_percentage_30d:
          data.market_data?.price_change_percentage_30d || 0,
        market_cap_change_24h: data.market_data?.market_cap_change_24h || 0,
        market_cap_change_percentage_24h:
          data.market_data?.market_cap_change_percentage_24h || 0,
        circulating_supply: data.market_data?.circulating_supply || 0,
        total_supply: data.market_data?.total_supply,
        max_supply: data.market_data?.max_supply,
        ath: data.market_data?.ath?.usd || 0,
        ath_change_percentage:
          data.market_data?.ath_change_percentage?.usd || 0,
        ath_date: data.market_data?.ath_date?.usd || new Date().toISOString(),
        atl: data.market_data?.atl?.usd || 0,
        atl_change_percentage:
          data.market_data?.atl_change_percentage?.usd || 0,
        atl_date: data.market_data?.atl_date?.usd || new Date().toISOString(),
        image:
          data.image?.large ||
          data.image?.small ||
          `https://via.placeholder.com/64x64/1f2937/ffffff?text=${data.symbol?.toUpperCase()}`,
        sparkline_in_7d: data.market_data?.sparkline_7d?.price || [],
        last_updated: data.last_updated || new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to fetch details for ${coinId}:`, error);
      return null;
    }
  }

  // Historical price data for charts
  async getHistoricalPrices(
    coinId: string,
    days: number = 30,
  ): Promise<number[][]> {
    try {
      const url = `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days > 90 ? "daily" : "hourly"}`;
      const cacheKey = `historical_${coinId}_${days}`;

      const data = await fetchWithCache(url, cacheKey);
      return data.prices || [];
    } catch (error) {
      console.error(`Failed to fetch historical data for ${coinId}:`, error);

      // Generate mock historical data
      const now = Date.now();
      const interval = (days * 24 * 60 * 60 * 1000) / 100; // 100 data points
      const basePrice = 43250; // Default BTC price

      return Array.from({ length: 100 }, (_, i) => {
        const timestamp = now - (99 - i) * interval;
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + change);
        return [timestamp, price];
      });
    }
  }

  // Trading
  async getOrderBook(symbol: string): Promise<OrderBook> {
    await this.delay(200);
    return {
      symbol,
      bids: Array.from({ length: 20 }, (_, i) => ({
        price: 43250 - i * 0.5,
        quantity: Math.random() * 10,
        total: (43250 - i * 0.5) * Math.random() * 10,
      })),
      asks: Array.from({ length: 20 }, (_, i) => ({
        price: 43251 + i * 0.5,
        quantity: Math.random() * 10,
        total: (43251 + i * 0.5) * Math.random() * 10,
      })),
      lastUpdateId: Date.now(),
      timestamp: new Date().toISOString(),
    };
  }

  async getRecentTrades(symbol: string, limit = 50): Promise<Trade[]> {
    await this.delay(200);
    const timestamp = Date.now();
    return Array.from({ length: limit }, (_, i) => ({
      id: `trade-${symbol}-${timestamp}-${i}`,
      symbol,
      price: 43250 + (Math.random() - 0.5) * 100,
      quantity: Math.random() * 5,
      quoteQuantity: 0,
      time: new Date(timestamp - i * 1000).toISOString(),
      isBuyerMaker: Math.random() > 0.5,
      isBestMatch: true,
    }));
  }

  async placeOrder(
    order: Omit<Order, "id" | "timestamp" | "updateTime" | "fills">,
  ): Promise<Order> {
    await this.delay(800);

    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      originalQuantity: order.quantity,
      executedQuantity: 0,
      cummulativeQuoteQty: 0,
      status: "NEW",
      fills: [],
      timestamp: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    return newOrder;
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.delay(500);
    console.log(`Order ${orderId} cancelled`);
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    await this.delay(300);
    return []; // Mock empty orders for now
  }

  async getOrderHistory(symbol?: string, limit = 50): Promise<Order[]> {
    await this.delay(400);
    return []; // Mock empty history for now
  }

  // Portfolio
  async getPortfolio(): Promise<Portfolio> {
    await this.delay(600);

    const assets = [
      {
        asset: "BTC",
        free: 0.15,
        locked: 0.05,
        total: 0.2,
        btcValue: 0.2,
        usdValue: 8650,
        price: 43250,
        change24h: 1234.25,
        changePercent24h: 2.94,
        allocation: 45.5,
      },
      {
        asset: "ETH",
        free: 2.5,
        locked: 0.5,
        total: 3.0,
        btcValue: 0.184,
        usdValue: 7937.67,
        price: 2645.89,
        change24h: -32.56,
        changePercent24h: -1.22,
        allocation: 41.8,
      },
      {
        asset: "USDT",
        free: 2412.45,
        locked: 0,
        total: 2412.45,
        btcValue: 0.056,
        usdValue: 2412.45,
        price: 1.0,
        change24h: 0,
        changePercent24h: 0,
        allocation: 12.7,
      },
    ];

    const totalValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
    const totalChange24h = assets.reduce(
      (sum, asset) => sum + asset.change24h * asset.total,
      0,
    );

    return {
      totalValue,
      totalChange24h,
      totalChangePercent24h: (totalChange24h / totalValue) * 100,
      assets,
      allocation: assets.map((asset) => ({
        asset: asset.asset,
        percentage: asset.allocation,
        value: asset.usdValue,
        color: this.getAssetColor(asset.asset),
      })),
    };
  }

  // P2P Trading
  async getP2POffers(filters?: any): Promise<P2POffer[]> {
    await this.delay(800);

    // Generate more mock offers
    return Array.from({ length: 12 }, (_, i) => ({
      ...mockP2POffers[0],
      id: `offer-${i + 1}`,
      price: 43200 + Math.random() * 200,
      user: {
        ...mockP2POffers[0].user,
        id: `user-${i + 1}`,
        username: `Trader${i + 1}`,
        rating: 4 + Math.random(),
        totalTrades: Math.floor(Math.random() * 2000),
        completionRate: 90 + Math.random() * 10,
        avgReleaseTime: 5 + Math.random() * 30,
      },
    }));
  }

  async createP2POffer(
    offer: Omit<P2POffer, "id" | "userId" | "user" | "createdAt" | "updatedAt">,
  ): Promise<P2POffer> {
    await this.delay(1000);

    const newOffer: P2POffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      userId: "current-user",
      user: {
        id: "current-user",
        username: "CurrentUser",
        isVerified: true,
        kycLevel: 2,
        rating: 4.8,
        totalTrades: 156,
        completionRate: 98.5,
        avgReleaseTime: 15,
        isOnline: true,
      },
      completionRate: 98.5,
      avgReleaseTime: 15,
      totalTrades: 156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newOffer;
  }

  // Staking
  async getStakingProducts(): Promise<StakingProduct[]> {
    await this.delay(400);
    return mockStakingProducts;
  }

  async getStakingPositions(): Promise<StakingPosition[]> {
    await this.delay(500);
    return [
      {
        id: "position-1",
        productId: "eth-staking-1",
        asset: "ETH",
        amount: 5.0,
        rewardAsset: "ETH",
        apy: 4.5,
        dailyReward: 0.00061644,
        totalRewards: 0.125,
        startDate: "2024-01-01T00:00:00Z",
        status: "ACTIVE",
        autoRenew: true,
      },
    ];
  }

  async stakeAsset(
    productId: string,
    amount: number,
  ): Promise<StakingPosition> {
    await this.delay(1200);

    const product = mockStakingProducts.find((p) => p.id === productId);
    if (!product) throw new Error("Staking product not found");

    return {
      id: `position-${Date.now()}`,
      productId,
      asset: product.asset,
      amount,
      rewardAsset: product.rewardAsset,
      apy: product.apy,
      dailyReward: (amount * product.apy) / 100 / 365,
      totalRewards: 0,
      startDate: new Date().toISOString(),
      endDate:
        product.type === "LOCKED"
          ? new Date(
              Date.now() + (product.duration || 0) * 24 * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      status: "ACTIVE",
      autoRenew: false,
    };
  }

  // News and Education
  async getNews(limit = 20, offset = 0): Promise<News[]> {
    await this.delay(400);
    return mockNews.slice(offset, offset + limit);
  }

  async getEducationContent(
    category?: string,
    level?: string,
  ): Promise<EducationContent[]> {
    await this.delay(500);
    return mockEducationContent;
  }

  // Watchlist and Alerts
  async getWatchlist(): Promise<WatchlistItem[]> {
    await this.delay(300);
    return [
      {
        id: "watch-1",
        asset: "BTC",
        addedAt: "2024-01-10T10:00:00Z",
        alerts: [],
        notes: "Watching for breakout above $45k",
      },
    ];
  }

  async addToWatchlist(asset: string, notes?: string): Promise<WatchlistItem> {
    await this.delay(400);
    return {
      id: `watch-${Date.now()}`,
      asset,
      addedAt: new Date().toISOString(),
      alerts: [],
      notes,
    };
  }

  async removeFromWatchlist(itemId: string): Promise<void> {
    await this.delay(300);
    console.log(`Removed ${itemId} from watchlist`);
  }

  async createAlert(
    alert: Omit<Alert, "id" | "createdAt" | "isTriggered" | "triggeredAt">,
  ): Promise<Alert> {
    await this.delay(500);
    return {
      ...alert,
      id: `alert-${Date.now()}`,
      isTriggered: false,
      createdAt: new Date().toISOString(),
    };
  }

  // Chart data
  async getChartData(
    symbol: string,
    timeframe: string,
    limit = 100,
  ): Promise<ChartData> {
    await this.delay(600);

    const basePrice = symbol === "BTCUSDT" ? 43250 : 2645;
    const now = Date.now();
    const interval = this.getIntervalMs(timeframe);

    return {
      symbol,
      timeframe,
      data: Array.from({ length: limit }, (_, i) => {
        const timestamp = now - (limit - i) * interval;
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + change);

        return {
          timestamp,
          open: price * (1 + (Math.random() - 0.5) * 0.01),
          high: price * (1 + Math.random() * 0.01),
          low: price * (1 - Math.random() * 0.01),
          close: price,
        };
      }),
      volume: Array.from({ length: limit }, (_, i) => ({
        timestamp: now - (limit - i) * interval,
        volume: Math.random() * 1000,
        buyVolume: Math.random() * 500,
        sellVolume: Math.random() * 500,
      })),
    };
  }

  // Transactions
  async getTransactions(limit = 50, offset = 0): Promise<Transaction[]> {
    await this.delay(400);
    return [
      {
        id: "tx-1",
        type: "TRADE",
        asset: "BTC",
        amount: 0.05,
        fee: 0.0001,
        feeAsset: "BTC",
        status: "CONFIRMED",
        timestamp: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
    ];
  }

  // Copy Trading
  async getCopyTradingProviders(): Promise<CopyTradingProvider[]> {
    await this.delay(600);
    return [
      {
        id: "provider-1",
        username: "CryptoMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=provider1",
        description:
          "Professional trader with 5+ years experience in crypto markets.",
        verified: true,
        rating: 4.8,
        followers: 2456,
        copiers: 189,
        aum: 1250000,
        performance: {
          totalReturn: 156.7,
          monthlyReturn: 12.4,
          sharpeRatio: 2.1,
          maxDrawdown: -15.2,
          winRate: 68.5,
        },
        assets: ["BTC", "ETH", "SOL"],
        riskScore: 6,
        minCopyAmount: 1000,
        fees: {
          management: 2.0,
          performance: 20.0,
        },
        isOpen: true,
      },
    ];
  }

  // Social Trading
  async getSocialTradingPosts(
    limit = 20,
    offset = 0,
  ): Promise<SocialTradingPost[]> {
    await this.delay(500);
    return [
      {
        id: "post-1",
        userId: "user-1",
        user: {
          id: "user-1",
          username: "TradingGuru",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guru",
          isVerified: true,
          kycLevel: 3,
          rating: 4.9,
          totalTrades: 567,
          completionRate: 99.1,
          avgReleaseTime: 8,
          isOnline: true,
        },
        type: "ANALYSIS",
        content:
          "Bitcoin is showing strong support at $43k. Looking for a breakout above $45k for continuation to $50k. 📈 #BTC #TechnicalAnalysis",
        trades: [
          {
            symbol: "BTCUSDT",
            side: "BUY",
            price: 43250,
            quantity: 0.1,
            pnl: 125.5,
            pnlPercent: 2.9,
          },
        ],
        likes: 234,
        comments: 56,
        shares: 12,
        isLiked: false,
        isFollowing: false,
        tags: ["BTC", "TechnicalAnalysis"],
        timestamp: "2024-01-15T14:30:00Z",
      },
    ];
  }

  // Utility methods
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getAssetColor(asset: string): string {
    const colors: Record<string, string> = {
      BTC: "#F7931A",
      ETH: "#627EEA",
      USDT: "#26A17B",
      BNB: "#F3BA2F",
      ADA: "#0033AD",
      SOL: "#9945FF",
      DOT: "#E6007A",
      AVAX: "#E84142",
    };
    return colors[asset] || "#6B7280";
  }

  private getIntervalMs(timeframe: string): number {
    const intervals: Record<string, number> = {
      "1m": 60 * 1000,
      "5m": 5 * 60 * 1000,
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "4h": 4 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "1w": 7 * 24 * 60 * 60 * 1000,
    };
    return intervals[timeframe] || intervals["1h"];
  }
}

export const cryptoService = new CryptoService();
export default cryptoService;
