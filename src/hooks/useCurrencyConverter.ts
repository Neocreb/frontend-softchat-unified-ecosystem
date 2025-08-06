import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { currencyService, type ConversionOptions, type ConversionResult } from '@/services/currencyService';
import { type Currency } from '@/config/currencies';

interface UseCurrencyConverterOptions {
  debounceMs?: number;
  autoConvert?: boolean;
  precision?: number;
  showSymbol?: boolean;
  showCode?: boolean;
}

interface CurrencyConverterState {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
  toAmount: number;
  rate: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useCurrencyConverter = (
  initialFromCurrency?: string,
  initialToCurrency?: string,
  options: UseCurrencyConverterOptions = {}
) => {
  const { userCurrency, getSupportedCurrencies, convert } = useCurrency();
  const {
    debounceMs = 300,
    autoConvert = true,
    precision = 2,
    showSymbol = true,
    showCode = false
  } = options;

  const [state, setState] = useState<CurrencyConverterState>(() => ({
    fromAmount: 0,
    fromCurrency: initialFromCurrency || 'USD',
    toCurrency: initialToCurrency || userCurrency.code,
    toAmount: 0,
    rate: 1,
    isLoading: false,
    error: null,
    lastUpdated: null
  }));

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Perform conversion
  const performConversion = useCallback(async (
    amount: number,
    from: string,
    to: string
  ) => {
    if (amount === 0 || from === to) {
      setState(prev => ({
        ...prev,
        toAmount: amount,
        rate: 1,
        error: null,
        lastUpdated: new Date()
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = convert(amount, from, to, {
        decimals: precision,
        showSymbol,
        showCode
      });

      setState(prev => ({
        ...prev,
        toAmount: result.amount,
        rate: result.rate,
        isLoading: false,
        lastUpdated: result.timestamp
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Conversion failed'
      }));
    }
  }, [convert, precision, showSymbol, showCode]);

  // Debounced conversion
  const debouncedConversion = useCallback((
    amount: number,
    from: string,
    to: string
  ) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      performConversion(amount, from, to);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [performConversion, debounceMs, debounceTimer]);

  // Update amounts
  const setFromAmount = useCallback((amount: number) => {
    setState(prev => ({ ...prev, fromAmount: amount }));
    
    if (autoConvert) {
      debouncedConversion(amount, state.fromCurrency, state.toCurrency);
    }
  }, [autoConvert, debouncedConversion, state.fromCurrency, state.toCurrency]);

  const setToAmount = useCallback((amount: number) => {
    setState(prev => ({ ...prev, toAmount: amount }));
    
    if (autoConvert && state.rate > 0) {
      const fromAmount = amount / state.rate;
      setState(prev => ({ ...prev, fromAmount }));
    }
  }, [autoConvert, state.rate]);

  // Update currencies
  const setFromCurrency = useCallback((currency: string) => {
    setState(prev => ({ ...prev, fromCurrency: currency }));
    
    if (autoConvert && state.fromAmount > 0) {
      debouncedConversion(state.fromAmount, currency, state.toCurrency);
    }
  }, [autoConvert, debouncedConversion, state.fromAmount, state.toCurrency]);

  const setToCurrency = useCallback((currency: string) => {
    setState(prev => ({ ...prev, toCurrency: currency }));
    
    if (autoConvert && state.fromAmount > 0) {
      debouncedConversion(state.fromAmount, state.fromCurrency, currency);
    }
  }, [autoConvert, debouncedConversion, state.fromAmount, state.fromCurrency]);

  // Swap currencies
  const swapCurrencies = useCallback(() => {
    setState(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
      rate: prev.rate > 0 ? 1 / prev.rate : 1
    }));
  }, []);

  // Manual conversion trigger
  const convertNow = useCallback(() => {
    performConversion(state.fromAmount, state.fromCurrency, state.toCurrency);
  }, [performConversion, state.fromAmount, state.fromCurrency, state.toCurrency]);

  // Reset converter
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      fromAmount: 0,
      toAmount: 0,
      rate: 1,
      error: null
    }));
  }, []);

  // Format amounts
  const formattedFromAmount = useMemo(() => {
    try {
      return currencyService.formatAmount(state.fromAmount, state.fromCurrency, {
        decimals: precision,
        showSymbol,
        showCode
      });
    } catch {
      return state.fromAmount.toString();
    }
  }, [state.fromAmount, state.fromCurrency, precision, showSymbol, showCode]);

  const formattedToAmount = useMemo(() => {
    try {
      return currencyService.formatAmount(state.toAmount, state.toCurrency, {
        decimals: precision,
        showSymbol,
        showCode
      });
    } catch {
      return state.toAmount.toString();
    }
  }, [state.toAmount, state.toCurrency, precision, showSymbol, showCode]);

  // Get currency objects
  const fromCurrencyObj = useMemo(() => {
    return getSupportedCurrencies().find(c => c.code === state.fromCurrency);
  }, [getSupportedCurrencies, state.fromCurrency]);

  const toCurrencyObj = useMemo(() => {
    return getSupportedCurrencies().find(c => c.code === state.toCurrency);
  }, [getSupportedCurrencies, state.toCurrency]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    // State
    fromAmount: state.fromAmount,
    fromCurrency: state.fromCurrency,
    toCurrency: state.toCurrency,
    toAmount: state.toAmount,
    rate: state.rate,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Currency objects
    fromCurrencyObj,
    toCurrencyObj,

    // Formatted values
    formattedFromAmount,
    formattedToAmount,

    // Actions
    setFromAmount,
    setToAmount,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
    convertNow,
    reset,

    // Utilities
    isValidConversion: state.fromAmount > 0 && state.rate > 0 && !state.error,
    conversionInfo: {
      rate: state.rate,
      inverse: state.rate > 0 ? 1 / state.rate : 0,
      pair: `${state.fromCurrency}/${state.toCurrency}`,
      lastUpdated: state.lastUpdated
    }
  };
};

// Hook for simple price conversions
export const usePriceConverter = (
  price: number,
  fromCurrency: string,
  toCurrency?: string
) => {
  const { userCurrency, convert } = useCurrency();
  const targetCurrency = toCurrency || userCurrency.code;

  return useMemo(() => {
    if (price === 0 || fromCurrency === targetCurrency) {
      return {
        originalPrice: price,
        convertedPrice: price,
        currency: targetCurrency,
        rate: 1,
        formattedPrice: currencyService.formatPrice(price, targetCurrency)
      };
    }

    try {
      const result = convert(price, fromCurrency, targetCurrency);
      return {
        originalPrice: price,
        convertedPrice: result.amount,
        currency: targetCurrency,
        rate: result.rate,
        formattedPrice: result.formattedAmount
      };
    } catch (error) {
      return {
        originalPrice: price,
        convertedPrice: price,
        currency: fromCurrency,
        rate: 1,
        formattedPrice: currencyService.formatPrice(price, fromCurrency),
        error: error instanceof Error ? error.message : 'Conversion failed'
      };
    }
  }, [price, fromCurrency, targetCurrency, convert]);
};

// Hook for batch conversions
export const useBatchConverter = () => {
  const { convert } = useCurrency();

  const convertBatch = useCallback((
    conversions: Array<{
      amount: number;
      from: string;
      to: string;
      id?: string;
    }>
  ) => {
    return conversions.map((conversion, index) => {
      try {
        const result = convert(conversion.amount, conversion.from, conversion.to);
        return {
          id: conversion.id || index.toString(),
          success: true,
          result,
          error: null
        };
      } catch (error) {
        return {
          id: conversion.id || index.toString(),
          success: false,
          result: null,
          error: error instanceof Error ? error.message : 'Conversion failed'
        };
      }
    });
  }, [convert]);

  return { convertBatch };
};

export default useCurrencyConverter;
