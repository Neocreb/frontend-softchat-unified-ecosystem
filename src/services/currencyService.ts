import { 
  STATIC_EXCHANGE_RATES, 
  SUPPORTED_CURRENCIES, 
  DEFAULT_CURRENCY,
  getCurrencyByCode,
  type Currency,
  type ExchangeRate 
} from '@/config/currencies';

export interface ConversionOptions {
  decimals?: number;
  showSymbol?: boolean;
  showCode?: boolean;
  locale?: string;
}

export interface ConversionResult {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  formattedAmount: string;
  timestamp: Date;
}

class CurrencyService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private cache: Map<string, ConversionResult> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private isApiEnabled = false; // Will be enabled when real-time API is integrated

  constructor() {
    this.initializeStaticRates();
  }

  /**
   * Initialize the service with static exchange rates
   */
  private initializeStaticRates(): void {
    STATIC_EXCHANGE_RATES.forEach(rate => {
      const key = `${rate.from}-${rate.to}`;
      this.exchangeRates.set(key, rate);
      
      // Add reverse rate
      const reverseKey = `${rate.to}-${rate.from}`;
      const reverseRate: ExchangeRate = {
        from: rate.to,
        to: rate.from,
        rate: 1 / rate.rate,
        lastUpdated: rate.lastUpdated,
        source: rate.source
      };
      this.exchangeRates.set(reverseKey, reverseRate);
    });
  }

  /**
   * Get exchange rate between two currencies
   */
  private getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;

    const directKey = `${fromCurrency}-${toCurrency}`;
    const directRate = this.exchangeRates.get(directKey);
    
    if (directRate) {
      return directRate.rate;
    }

    // Try to find a route through USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const fromUsdKey = `${fromCurrency}-USD`;
      const toUsdKey = `USD-${toCurrency}`;
      
      const fromUsdRate = this.exchangeRates.get(fromUsdKey);
      const toUsdRate = this.exchangeRates.get(toUsdKey);
      
      if (fromUsdRate && toUsdRate) {
        return fromUsdRate.rate * toUsdRate.rate;
      }
    }

    // Fallback: assume 1:1 ratio (should log warning in production)
    console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}, using 1:1 ratio`);
    return 1;
  }

  /**
   * Convert amount from one currency to another
   */
  public convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    options: ConversionOptions = {}
  ): ConversionResult {
    const cacheKey = `${amount}-${fromCurrency}-${toCurrency}-${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp.getTime() < this.cacheTimeout) {
      return cached;
    }

    const fromCurrencyObj = getCurrencyByCode(fromCurrency);
    const toCurrencyObj = getCurrencyByCode(toCurrency);

    if (!fromCurrencyObj || !toCurrencyObj) {
      throw new Error(`Unsupported currency: ${!fromCurrencyObj ? fromCurrency : toCurrency}`);
    }

    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;
    
    const result: ConversionResult = {
      amount: convertedAmount,
      fromCurrency: fromCurrencyObj,
      toCurrency: toCurrencyObj,
      rate,
      formattedAmount: this.formatAmount(convertedAmount, toCurrencyObj, options),
      timestamp: new Date()
    };

    // Cache the result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Format amount according to currency and options
   */
  public formatAmount(
    amount: number,
    currency: Currency | string,
    options: ConversionOptions = {}
  ): string {
    const currencyObj = typeof currency === 'string' ? getCurrencyByCode(currency) : currency;
    if (!currencyObj) {
      throw new Error(`Invalid currency: ${currency}`);
    }

    const {
      decimals = currencyObj.decimals,
      showSymbol = true,
      showCode = false,
      locale = 'en-US'
    } = options;

    const formattedNumber = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    let result = formattedNumber;

    if (showSymbol) {
      // For crypto currencies, often put symbol after the number
      if (currencyObj.isCrypto) {
        result = `${result} ${currencyObj.symbol}`;
      } else {
        result = `${currencyObj.symbol}${result}`;
      }
    }

    if (showCode) {
      result = `${result} ${currencyObj.code}`;
    }

    return result;
  }

  /**
   * Format price with automatic currency detection
   */
  public formatPrice(
    price: number,
    currencyCode: string = DEFAULT_CURRENCY,
    options: ConversionOptions = {}
  ): string {
    return this.formatAmount(price, currencyCode, {
      showSymbol: true,
      showCode: false,
      ...options
    });
  }

  /**
   * Convert and format in one step
   */
  public convertAndFormat(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    options: ConversionOptions = {}
  ): string {
    const result = this.convert(amount, fromCurrency, toCurrency, options);
    return result.formattedAmount;
  }

  /**
   * Get all supported currencies
   */
  public getSupportedCurrencies(): Currency[] {
    return SUPPORTED_CURRENCIES;
  }

  /**
   * Get supported currencies by category
   */
  public getCurrenciesByCategory(category: Currency['category']): Currency[] {
    return SUPPORTED_CURRENCIES.filter(currency => currency.category === category);
  }

  /**
   * Check if a currency is supported
   */
  public isCurrencySupported(currencyCode: string): boolean {
    return SUPPORTED_CURRENCIES.some(currency => currency.code === currencyCode);
  }

  /**
   * Get current exchange rates (for display purposes)
   */
  public getExchangeRates(): ExchangeRate[] {
    return Array.from(this.exchangeRates.values());
  }

  /**
   * Update exchange rates (for future real-time API integration)
   */
  public async updateExchangeRates(): Promise<void> {
    if (!this.isApiEnabled) {
      console.info('Real-time exchange rates not enabled, using static rates');
      return;
    }

    try {
      // TODO: Implement real-time API integration
      // const response = await fetch('/api/exchange-rates');
      // const rates = await response.json();
      // this.processApiRates(rates);
      console.info('Real-time exchange rate update would happen here');
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  /**
   * Enable real-time exchange rates (for future use)
   */
  public enableRealTimeRates(apiKey?: string): void {
    this.isApiEnabled = true;
    // TODO: Set up real-time rate updates
    console.info('Real-time exchange rates enabled');
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get popular currency pairs
   */
  public getPopularPairs(): string[] {
    return [
      'USD/EUR', 'USD/GBP', 'USD/NGN', 'USD/ZAR',
      'USD/BTC', 'USD/ETH', 'USD/USDT'
    ];
  }

  /**
   * Calculate percentage change between two amounts
   */
  public calculatePercentageChange(oldAmount: number, newAmount: number): number {
    if (oldAmount === 0) return 0;
    return ((newAmount - oldAmount) / oldAmount) * 100;
  }

  /**
   * Get currency trend (for future implementation with historical data)
   */
  public getCurrencyTrend(currencyCode: string): 'up' | 'down' | 'stable' {
    // TODO: Implement with historical data
    return 'stable';
  }
}

// Create singleton instance
export const currencyService = new CurrencyService();

// Export commonly used functions for convenience
export const {
  convert,
  formatAmount,
  formatPrice,
  convertAndFormat,
  getSupportedCurrencies,
  getCurrenciesByCategory,
  isCurrencySupported
} = currencyService;

export default currencyService;
