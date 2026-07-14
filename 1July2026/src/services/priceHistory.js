// Price History Service - Generates historical price data
// In production, this would fetch from your backend API/database

// Generate realistic price history data
export const generatePriceHistory = (currentPrice, days = 90) => {
  const history = [];
  const today = new Date();

  // Start from X days ago
  let price = currentPrice * (0.85 + Math.random() * 0.3); // Start 15-30% different

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add realistic price volatility
    const volatility = 0.03; // 3% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + change);

    // Add occasional spikes/drops
    if (Math.random() < 0.05) { // 5% chance of big move
      const bigMove = (Math.random() - 0.5) * 0.2; // ±10%
      price = price * (1 + bigMove);
    }

    // Keep price positive and reasonable
    price = Math.max(price, currentPrice * 0.5);
    price = Math.min(price, currentPrice * 1.8);

    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      timestamp: date.getTime()
    });
  }

  // Ensure last price is close to current price
  const lastIndex = history.length - 1;
  history[lastIndex].price = currentPrice;

  return history;
};

// Get price statistics from history
export const getPriceStats = (history) => {
  if (!history || history.length === 0) return null;

  const prices = history.map(h => h.price);
  const currentPrice = prices[prices.length - 1];
  const startPrice = prices[0];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const priceChange = currentPrice - startPrice;
  const priceChangePercent = ((priceChange / startPrice) * 100).toFixed(2);

  return {
    current: currentPrice,
    start: startPrice,
    min: minPrice,
    max: maxPrice,
    average: parseFloat(avgPrice.toFixed(2)),
    change: parseFloat(priceChange.toFixed(2)),
    changePercent: parseFloat(priceChangePercent),
    volatility: calculateVolatility(prices)
  };
};

// Calculate price volatility (standard deviation)
const calculateVolatility = (prices) => {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  return parseFloat((stdDev * 100).toFixed(2)); // Return as percentage
};

// Filter history by date range
export const filterHistoryByRange = (history, range) => {
  if (!history || history.length === 0) return [];

  const today = new Date();
  let startDate;

  switch (range) {
    case '7d':
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '180d':
      startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      return history;
  }

  return history.filter(h => h.timestamp >= startDate.getTime());
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format date for tooltip
export const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Store price history in localStorage (cache)
export const cachePriceHistory = (cardId, history) => {
  try {
    const cache = {
      history,
      timestamp: Date.now(),
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours
    };
    localStorage.setItem(`price_history_${cardId}`, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to cache price history:', e);
  }
};

// Get cached price history
export const getCachedPriceHistory = (cardId) => {
  try {
    const cached = localStorage.getItem(`price_history_${cardId}`);
    if (!cached) return null;

    const cache = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - cache.timestamp < cache.expiresIn) {
      return cache.history;
    }

    // Cache expired
    localStorage.removeItem(`price_history_${cardId}`);
    return null;
  } catch (e) {
    console.error('Failed to get cached price history:', e);
    return null;
  }
};
