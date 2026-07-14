// Portfolio Analytics Service
// Calculates portfolio performance, gains/losses, and investment metrics

import { generatePriceHistory } from './priceHistory';

// Calculate portfolio value at a specific date
export const calculatePortfolioValueAtDate = (cards, date) => {
  return cards.reduce((total, card) => {
    const price = card.tcgplayer?.prices?.holofoil?.market ||
                  card.tcgplayer?.prices?.normal?.market || 0;
    return total + price;
  }, 0);
};

// Generate portfolio value history over time
export const generatePortfolioHistory = (cards, days = 90) => {
  if (!cards || cards.length === 0) return [];

  const history = [];
  const today = new Date();

  // Generate history for each day
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    let totalValue = 0;

    // Sum up all card values for this date
    cards.forEach(card => {
      const currentPrice = card.tcgplayer?.prices?.holofoil?.market ||
                           card.tcgplayer?.prices?.normal?.market || 0;

      // Generate historical price for this card at this date
      const cardHistory = generatePriceHistory(currentPrice, days);
      const priceAtDate = cardHistory[days - i]?.price || currentPrice;

      totalValue += priceAtDate;
    });

    history.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(totalValue.toFixed(2)),
      timestamp: date.getTime()
    });
  }

  return history;
};

// Calculate individual card performance
export const calculateCardPerformance = (card, days = 90) => {
  const currentPrice = card.tcgplayer?.prices?.holofoil?.market ||
                       card.tcgplayer?.prices?.normal?.market || 0;

  const history = generatePriceHistory(currentPrice, days);
  const startPrice = history[0]?.price || currentPrice;

  const gain = currentPrice - startPrice;
  const gainPercent = startPrice > 0 ? ((gain / startPrice) * 100) : 0;

  return {
    cardId: card.id,
    cardName: card.name,
    cardImage: card.images?.small || card.images?.large,
    currentPrice: currentPrice,
    startPrice: startPrice,
    gain: parseFloat(gain.toFixed(2)),
    gainPercent: parseFloat(gainPercent.toFixed(2)),
    isPositive: gain >= 0
  };
};

// Get portfolio performance metrics
export const getPortfolioMetrics = (cards, days = 90) => {
  if (!cards || cards.length === 0) {
    return {
      totalValue: 0,
      totalGain: 0,
      totalGainPercent: 0,
      bestPerformer: null,
      worstPerformer: null,
      avgCardValue: 0,
      totalCards: 0
    };
  }

  const history = generatePortfolioHistory(cards, days);
  const currentValue = history[history.length - 1]?.value || 0;
  const startValue = history[0]?.value || 0;

  const totalGain = currentValue - startValue;
  const totalGainPercent = startValue > 0 ? ((totalGain / startValue) * 100) : 0;

  // Calculate individual card performances
  const performances = cards.map(card => calculateCardPerformance(card, days));

  // Sort by gain percent to find best/worst
  const sortedByGain = [...performances].sort((a, b) => b.gainPercent - a.gainPercent);

  return {
    totalValue: parseFloat(currentValue.toFixed(2)),
    startValue: parseFloat(startValue.toFixed(2)),
    totalGain: parseFloat(totalGain.toFixed(2)),
    totalGainPercent: parseFloat(totalGainPercent.toFixed(2)),
    bestPerformer: sortedByGain[0] || null,
    worstPerformer: sortedByGain[sortedByGain.length - 1] || null,
    avgCardValue: parseFloat((currentValue / cards.length).toFixed(2)),
    totalCards: cards.length,
    performances: performances
  };
};

// Get top/bottom performers
export const getTopPerformers = (cards, limit = 5, days = 90) => {
  const performances = cards.map(card => calculateCardPerformance(card, days));

  return performances
    .sort((a, b) => b.gainPercent - a.gainPercent)
    .slice(0, limit);
};

export const getBottomPerformers = (cards, limit = 5, days = 90) => {
  const performances = cards.map(card => calculateCardPerformance(card, days));

  return performances
    .sort((a, b) => a.gainPercent - b.gainPercent)
    .slice(0, limit);
};

// Calculate portfolio diversity metrics
export const getPortfolioDiversity = (cards) => {
  if (!cards || cards.length === 0) return null;

  const bySet = {};
  const byRarity = {};
  const byType = {};

  cards.forEach(card => {
    // By set
    const setName = card.set?.name || 'Unknown';
    bySet[setName] = (bySet[setName] || 0) + 1;

    // By rarity
    const rarity = card.rarity || 'Common';
    byRarity[rarity] = (byRarity[rarity] || 0) + 1;

    // By type
    const type = card.supertype || 'Unknown';
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    bySet: Object.entries(bySet).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / cards.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count),

    byRarity: Object.entries(byRarity).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / cards.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count),

    byType: Object.entries(byType).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / cards.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count)
  };
};

// Calculate risk metrics
export const calculateRiskMetrics = (cards, days = 90) => {
  if (!cards || cards.length === 0) return null;

  const performances = cards.map(card => calculateCardPerformance(card, days));

  // Calculate volatility (standard deviation of returns)
  const returns = performances.map(p => p.gainPercent);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  // Sharpe ratio (simplified - assuming risk-free rate of 0)
  const sharpeRatio = volatility > 0 ? (avgReturn / volatility) : 0;

  return {
    volatility: parseFloat(volatility.toFixed(2)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
    avgReturn: parseFloat(avgReturn.toFixed(2)),
    riskLevel: volatility < 10 ? 'Low' : volatility < 20 ? 'Medium' : 'High'
  };
};

// Calculate ROI for the entire portfolio
export const calculateROI = (currentValue, initialInvestment) => {
  if (!initialInvestment || initialInvestment === 0) return 0;

  const roi = ((currentValue - initialInvestment) / initialInvestment) * 100;
  return parseFloat(roi.toFixed(2));
};

// Get portfolio summary for export
export const getPortfolioSummary = (cards, days = 90) => {
  const metrics = getPortfolioMetrics(cards, days);
  const diversity = getPortfolioDiversity(cards);
  const risk = calculateRiskMetrics(cards, days);

  return {
    summary: {
      totalCards: metrics.totalCards,
      totalValue: metrics.totalValue,
      totalGain: metrics.totalGain,
      totalGainPercent: metrics.totalGainPercent,
      avgCardValue: metrics.avgCardValue
    },
    performance: {
      bestPerformer: metrics.bestPerformer,
      worstPerformer: metrics.worstPerformer,
      topPerformers: getTopPerformers(cards, 5, days),
      bottomPerformers: getBottomPerformers(cards, 5, days)
    },
    diversity: diversity,
    risk: risk,
    generatedAt: new Date().toISOString()
  };
};

// Format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage
export const formatPercent = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
