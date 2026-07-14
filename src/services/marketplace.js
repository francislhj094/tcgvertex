// Multi-Marketplace Price Comparison Service
// Fetches and compares prices across TCGPlayer, eBay, and other marketplaces

// Simulate eBay price fetching (in production, use eBay API)
export const fetchEbayPrice = async (cardName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate realistic eBay prices (slightly different from TCGPlayer)
  const variance = 0.85 + Math.random() * 0.3; // ±15% variance

  return {
    source: 'ebay',
    sourceName: 'eBay',
    available: Math.random() > 0.1, // 90% availability
    prices: {
      buyNow: null, // Will be calculated
      auction: null,
      avgSold: null
    },
    shipping: (Math.random() * 5).toFixed(2), // $0-5 shipping
    condition: 'Near Mint',
    url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName)}+pokemon`,
    lastUpdated: new Date().toISOString()
  };
};

// Simulate CardMarket price fetching (in production, use CardMarket API)
export const fetchCardMarketPrice = async (cardName) => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const variance = 0.9 + Math.random() * 0.2;

  return {
    source: 'cardmarket',
    sourceName: 'CardMarket',
    available: Math.random() > 0.2, // 80% availability
    prices: {
      low: null,
      trend: null,
      avg30day: null
    },
    shipping: (Math.random() * 3 + 2).toFixed(2), // $2-5 shipping (EU)
    condition: 'Near Mint',
    url: `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodeURIComponent(cardName)}`,
    lastUpdated: new Date().toISOString()
  };
};

// Get all marketplace prices for a card
export const getAllMarketplacePrices = async (card, basePrice) => {
  const cardName = card.name;

  try {
    // Fetch from all marketplaces in parallel
    const [ebayData, cardMarketData] = await Promise.all([
      fetchEbayPrice(cardName),
      fetchCardMarketPrice(cardName)
    ]);

    // Calculate prices based on base price with variance
    if (ebayData.available) {
      const ebayVariance = 0.85 + Math.random() * 0.3;
      ebayData.prices.buyNow = parseFloat((basePrice * ebayVariance).toFixed(2));
      ebayData.prices.auction = parseFloat((basePrice * ebayVariance * 0.85).toFixed(2)); // Auctions typically lower
      ebayData.prices.avgSold = parseFloat((basePrice * ebayVariance * 0.95).toFixed(2));
    }

    if (cardMarketData.available) {
      const cmVariance = 0.9 + Math.random() * 0.2;
      cardMarketData.prices.low = parseFloat((basePrice * cmVariance * 0.9).toFixed(2));
      cardMarketData.prices.trend = parseFloat((basePrice * cmVariance).toFixed(2));
      cardMarketData.prices.avg30day = parseFloat((basePrice * cmVariance * 0.98).toFixed(2));
    }

    // TCGPlayer data (already have this)
    const tcgPlayerData = {
      source: 'tcgplayer',
      sourceName: 'TCGPlayer',
      available: true,
      prices: {
        market: basePrice,
        low: basePrice * 0.95,
        mid: basePrice,
        high: basePrice * 1.1
      },
      shipping: 0.99, // TCGPlayer typical shipping
      condition: 'Near Mint',
      url: card.tcgplayer?.url || '#',
      lastUpdated: new Date().toISOString()
    };

    return {
      tcgplayer: tcgPlayerData,
      ebay: ebayData,
      cardmarket: cardMarketData
    };
  } catch (error) {
    console.error('Error fetching marketplace prices:', error);
    return null;
  }
};

// Find the best deal across all marketplaces
export const findBestDeal = (marketplaces) => {
  if (!marketplaces) return null;

  const deals = [];

  // TCGPlayer
  if (marketplaces.tcgplayer?.available) {
    deals.push({
      marketplace: 'TCGPlayer',
      source: 'tcgplayer',
      price: marketplaces.tcgplayer.prices.market,
      totalPrice: marketplaces.tcgplayer.prices.market + parseFloat(marketplaces.tcgplayer.shipping),
      shipping: parseFloat(marketplaces.tcgplayer.shipping),
      url: marketplaces.tcgplayer.url,
      priceType: 'Market Price'
    });
  }

  // eBay
  if (marketplaces.ebay?.available && marketplaces.ebay.prices.buyNow) {
    deals.push({
      marketplace: 'eBay',
      source: 'ebay',
      price: marketplaces.ebay.prices.buyNow,
      totalPrice: marketplaces.ebay.prices.buyNow + parseFloat(marketplaces.ebay.shipping),
      shipping: parseFloat(marketplaces.ebay.shipping),
      url: marketplaces.ebay.url,
      priceType: 'Buy Now'
    });
  }

  // CardMarket
  if (marketplaces.cardmarket?.available && marketplaces.cardmarket.prices.low) {
    deals.push({
      marketplace: 'CardMarket',
      source: 'cardmarket',
      price: marketplaces.cardmarket.prices.low,
      totalPrice: marketplaces.cardmarket.prices.low + parseFloat(marketplaces.cardmarket.shipping),
      shipping: parseFloat(marketplaces.cardmarket.shipping),
      url: marketplaces.cardmarket.url,
      priceType: 'Lowest Price'
    });
  }

  // Sort by total price (including shipping)
  deals.sort((a, b) => a.totalPrice - b.totalPrice);

  return deals.length > 0 ? deals[0] : null;
};

// Calculate savings compared to other marketplaces
export const calculateSavings = (marketplaces, bestDeal) => {
  if (!marketplaces || !bestDeal) return null;

  const allPrices = [];

  if (marketplaces.tcgplayer?.available) {
    allPrices.push(marketplaces.tcgplayer.prices.market + parseFloat(marketplaces.tcgplayer.shipping));
  }

  if (marketplaces.ebay?.available && marketplaces.ebay.prices.buyNow) {
    allPrices.push(marketplaces.ebay.prices.buyNow + parseFloat(marketplaces.ebay.shipping));
  }

  if (marketplaces.cardmarket?.available && marketplaces.cardmarket.prices.low) {
    allPrices.push(marketplaces.cardmarket.prices.low + parseFloat(marketplaces.cardmarket.shipping));
  }

  const maxPrice = Math.max(...allPrices);
  const savings = maxPrice - bestDeal.totalPrice;
  const savingsPercent = ((savings / maxPrice) * 100).toFixed(1);

  return {
    amount: parseFloat(savings.toFixed(2)),
    percent: parseFloat(savingsPercent),
    comparedTo: maxPrice.toFixed(2)
  };
};

// Get price comparison summary
export const getPriceComparison = (marketplaces) => {
  if (!marketplaces) return null;

  const bestDeal = findBestDeal(marketplaces);
  const savings = calculateSavings(marketplaces, bestDeal);

  const availableMarketplaces = [];
  if (marketplaces.tcgplayer?.available) availableMarketplaces.push('TCGPlayer');
  if (marketplaces.ebay?.available) availableMarketplaces.push('eBay');
  if (marketplaces.cardmarket?.available) availableMarketplaces.push('CardMarket');

  return {
    bestDeal,
    savings,
    availableMarketplaces,
    totalMarketplaces: availableMarketplaces.length,
    lastUpdated: new Date().toISOString()
  };
};

// Format marketplace name for display
export const formatMarketplaceName = (source) => {
  const names = {
    tcgplayer: 'TCGPlayer',
    ebay: 'eBay',
    cardmarket: 'CardMarket',
    amazon: 'Amazon'
  };
  return names[source] || source;
};

// Get marketplace logo/icon
export const getMarketplaceLogo = (source) => {
  // In production, return actual logo URLs
  const logos = {
    tcgplayer: '🎴',
    ebay: '🏪',
    cardmarket: '🌍',
    amazon: '📦'
  };
  return logos[source] || '🛒';
};

// Cache marketplace data
export const cacheMarketplaceData = (cardId, data) => {
  try {
    const cache = {
      data,
      timestamp: Date.now(),
      expiresIn: 6 * 60 * 60 * 1000 // 6 hours
    };
    localStorage.setItem(`marketplace_${cardId}`, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to cache marketplace data:', e);
  }
};

// Get cached marketplace data
export const getCachedMarketplaceData = (cardId) => {
  try {
    const cached = localStorage.getItem(`marketplace_${cardId}`);
    if (!cached) return null;

    const cache = JSON.parse(cached);
    const now = Date.now();

    if (now - cache.timestamp < cache.expiresIn) {
      return cache.data;
    }

    localStorage.removeItem(`marketplace_${cardId}`);
    return null;
  } catch (e) {
    console.error('Failed to get cached marketplace data:', e);
    return null;
  }
};
