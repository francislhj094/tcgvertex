import React, { createContext, useContext, useState, useEffect } from 'react';

const CountryContext = createContext();

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within CountryProvider');
  }
  return context;
};

// Country configurations
export const COUNTRIES = {
  US: {
    code: 'US',
    name: 'United States',
    language: 'en',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    priceMultiplier: 1, // Base price
    locale: 'en-US'
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    language: 'en',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    priceMultiplier: 1.52, // Approximate USD to AUD conversion (updates dynamically in real market)
    locale: 'en-AU'
  },
  DE: {
    code: 'DE',
    name: 'Deutschland',
    language: 'de',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
    priceMultiplier: 0.92, // Approximate USD to EUR conversion
    locale: 'de-DE'
  }
};

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(() => {
    // Check if user has manually selected a country before
    const saved = localStorage.getItem('selectedCountry');
    if (saved && COUNTRIES[saved]) {
      return COUNTRIES[saved];
    }

    // Auto-detect from browser language and timezone
    const browserLang = navigator.language || navigator.userLanguage;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // If browser language is German (de, de-DE, de-AT, de-CH, etc.), set to Germany
    if (browserLang.toLowerCase().startsWith('de')) {
      return COUNTRIES.DE;
    }

    // If browser language is English-Australian or timezone is Australian, set to Australia
    if (
      browserLang.toLowerCase().startsWith('en-au') ||
      timezone.startsWith('Australia/')
    ) {
      return COUNTRIES.AU;
    }

    // Default to US for all other languages
    return COUNTRIES.US;
  });

  const [hasAutoDetected, setHasAutoDetected] = useState(() => {
    // Check if we've already auto-detected on first visit
    return localStorage.getItem('hasAutoDetected') === 'true';
  });

  useEffect(() => {
    // Only auto-detect once on first visit
    if (!hasAutoDetected) {
      localStorage.setItem('hasAutoDetected', 'true');
      setHasAutoDetected(true);
    }
  }, [hasAutoDetected]);

  useEffect(() => {
    // Save to localStorage when country changes
    localStorage.setItem('selectedCountry', country.code);
  }, [country]);

  const switchCountry = (countryCode) => {
    if (COUNTRIES[countryCode]) {
      setCountry(COUNTRIES[countryCode]);
    }
  };

  // Format price based on selected country
  const formatPrice = (usdPrice) => {
    const price = usdPrice * country.priceMultiplier;
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Format date based on locale
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(country.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Format number based on locale
  const formatNumber = (number) => {
    return new Intl.NumberFormat(country.locale).format(number);
  };

  const value = {
    country,
    switchCountry,
    formatPrice,
    formatDate,
    formatNumber,
    isGerman: country.code === 'DE',
    isUS: country.code === 'US',
    isAustralian: country.code === 'AU'
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};
