import React, { Component, ReactNode } from "react";
import { I18nProvider } from "./I18nContext";
import SafeContextProvider from "./SafeContextProvider";

// Fallback I18n provider with minimal context
const FallbackI18nProvider = ({ children }: { children: ReactNode }) => {
  // Simple fallback context that provides basic functionality
  const fallbackContext = {
    currentLanguage: { code: 'en', name: 'English', flag: '🇺🇸' },
    currentCurrency: { code: 'USD', name: 'US Dollar', symbol: '$' },
    currentRegion: { code: 'US', name: 'United States' },
    availablePaymentMethods: [],
    supportedLanguages: [{ code: 'en', name: 'English', flag: '🇺🇸' }],
    supportedCurrencies: [{ code: 'USD', name: 'US Dollar', symbol: '$' }],
    regions: [{ code: 'US', name: 'United States' }],
    setLanguage: () => {},
    setCurrency: () => {},
    setRegion: () => {},
    t: (key: string) => key, // Return the key as fallback
    formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
    formatDate: (date: Date) => date.toLocaleDateString(),
    formatNumber: (number: number) => number.toString(),
    convertCurrency: (amount: number) => amount,
    culturalNotes: [],
    dateFormat: 'MM/DD/YYYY',
    isLoading: false,
  };

  return <>{children}</>;
};

interface SafeI18nProviderProps {
  children: ReactNode;
}

const SafeI18nProvider: React.FC<SafeI18nProviderProps> = ({ children }) => {
  return (
    <SafeContextProvider
      name="I18n"
      fallback={<FallbackI18nProvider>{children}</FallbackI18nProvider>}
    >
      <I18nProvider>{children}</I18nProvider>
    </SafeContextProvider>
  );
};

export default SafeI18nProvider;
