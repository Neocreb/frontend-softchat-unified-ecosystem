// Centralized currency configuration for the entire platform
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
  decimals: number;
  isDefault?: boolean;
  isCrypto?: boolean;
  category: 'fiat' | 'crypto' | 'stablecoin';
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
  source: 'static' | 'api' | 'cache';
}

// Supported currencies across the platform
export const SUPPORTED_CURRENCIES: Currency[] = [
  // Major Fiat Currencies
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    country: 'United States',
    flag: '🇺🇸',
    decimals: 2,
    isDefault: true,
    category: 'fiat'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    country: 'European Union',
    flag: '🇪🇺',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    country: 'United Kingdom',
    flag: '🇬🇧',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    country: 'Japan',
    flag: '🇯🇵',
    decimals: 0,
    category: 'fiat'
  },
  
  // African Currencies
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    country: 'Nigeria',
    flag: '🇳🇬',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    country: 'South Africa',
    flag: '🇿🇦',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    country: 'Kenya',
    flag: '🇰🇪',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    country: 'Ghana',
    flag: '🇬🇭',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: '£',
    country: 'Egypt',
    flag: '🇪🇬',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'DH',
    country: 'Morocco',
    flag: '🇲🇦',
    decimals: 2,
    category: 'fiat'
  },
  {
    code: 'TND',
    name: 'Tunisian Dinar',
    symbol: 'TND',
    country: 'Tunisia',
    flag: '🇹🇳',
    decimals: 3,
    category: 'fiat'
  },
  {
    code: 'BWP',
    name: 'Botswana Pula',
    symbol: 'P',
    country: 'Botswana',
    flag: '🇧🇼',
    decimals: 2,
    category: 'fiat'
  },
  
  // Cryptocurrencies
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    country: 'Global',
    flag: '₿',
    decimals: 8,
    isCrypto: true,
    category: 'crypto'
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    country: 'Global',
    flag: 'Ξ',
    decimals: 18,
    isCrypto: true,
    category: 'crypto'
  },
  {
    code: 'USDT',
    name: 'Tether USD',
    symbol: '₮',
    country: 'Global',
    flag: '₮',
    decimals: 6,
    isCrypto: true,
    category: 'stablecoin'
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    country: 'Global',
    flag: '◯',
    decimals: 6,
    isCrypto: true,
    category: 'stablecoin'
  },
  {
    code: 'BNB',
    name: 'Binance Coin',
    symbol: 'BNB',
    country: 'Global',
    flag: '🔶',
    decimals: 18,
    isCrypto: true,
    category: 'crypto'
  },
  {
    code: 'ADA',
    name: 'Cardano',
    symbol: 'ADA',
    country: 'Global',
    flag: '💙',
    decimals: 6,
    isCrypto: true,
    category: 'crypto'
  },
  {
    code: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    country: 'Global',
    flag: '◎',
    decimals: 9,
    isCrypto: true,
    category: 'crypto'
  },
  
  // Platform Tokens
  {
    code: 'SOFT',
    name: 'SoftChat Token',
    symbol: 'SOFT',
    country: 'Platform',
    flag: '🚀',
    decimals: 18,
    isCrypto: true,
    category: 'crypto'
  }
];

// Static exchange rates (to be replaced with real-time API later)
export const STATIC_EXCHANGE_RATES: ExchangeRate[] = [
  // USD as base currency
  { from: 'USD', to: 'EUR', rate: 0.92, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'GBP', rate: 0.79, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'JPY', rate: 149.50, lastUpdated: new Date(), source: 'static' },
  
  // African currencies
  { from: 'USD', to: 'NGN', rate: 1543.75, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'ZAR', rate: 18.85, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'KES', rate: 154.25, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'GHS', rate: 12.15, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'EGP', rate: 30.85, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'MAD', rate: 10.12, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'TND', rate: 3.15, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'BWP', rate: 13.65, lastUpdated: new Date(), source: 'static' },
  
  // Cryptocurrencies (highly volatile - these are example rates)
  { from: 'USD', to: 'BTC', rate: 0.000023, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'ETH', rate: 0.00041, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'USDT', rate: 1.0, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'USDC', rate: 1.0, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'BNB', rate: 0.0032, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'ADA', rate: 2.44, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'SOL', rate: 0.0095, lastUpdated: new Date(), source: 'static' },
  { from: 'USD', to: 'SOFT', rate: 1000, lastUpdated: new Date(), source: 'static' }, // 1 USD = 1000 SOFT tokens
];

// Currency categories for filtering and organization
export const CURRENCY_CATEGORIES = {
  fiat: 'Fiat Currencies',
  crypto: 'Cryptocurrencies',
  stablecoin: 'Stablecoins'
} as const;

// Popular currency pairs for quick access
export const POPULAR_PAIRS = [
  'USD/EUR',
  'USD/GBP',
  'USD/NGN',
  'USD/ZAR',
  'USD/BTC',
  'USD/ETH',
  'USD/USDT'
];

// Default currency settings
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_DISPLAY_DECIMALS = 2;

// Helper functions
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code);
};

export const getCurrenciesByCategory = (category: Currency['category']): Currency[] => {
  return SUPPORTED_CURRENCIES.filter(currency => currency.category === category);
};

export const getDefaultCurrency = (): Currency => {
  return SUPPORTED_CURRENCIES.find(currency => currency.isDefault) || SUPPORTED_CURRENCIES[0];
};

export const isCryptoCurrency = (code: string): boolean => {
  const currency = getCurrencyByCode(code);
  return currency?.isCrypto || false;
};

export const getFiatCurrencies = (): Currency[] => {
  return getCurrenciesByCategory('fiat');
};

export const getCryptoCurrencies = (): Currency[] => {
  return [...getCurrenciesByCategory('crypto'), ...getCurrenciesByCategory('stablecoin')];
};
