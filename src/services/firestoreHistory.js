// Client-side Firestore Historical Price Service
// Queries and manages price history data points stored in Firestore.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const HISTORY_COLLECTION = 'priceHistory';
const SNAPSHOTS_SUBCOLLECTION = 'snapshots';

/**
 * Fetch historical price snapshots for a card sorted by date ascending.
 * @param {string} cardId - The unique ID of the Pokémon card.
 * @returns {Promise<Array>} List of price snapshot objects.
 */
export const fetchPriceHistory = async (cardId) => {
  if (!cardId) return [];

  try {
    const snapshotsRef = collection(db, HISTORY_COLLECTION, cardId, SNAPSHOTS_SUBCOLLECTION);
    const historyQuery = query(snapshotsRef, orderBy('date', 'asc'));
    const snapshot = await getDocs(historyQuery);
    
    const history = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      history.push({
        date: data.date,
        price: data.price,
        timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
      });
    });
    
    return history;
  } catch (error) {
    console.error(`Error fetching price history for card ${cardId}:`, error);
    return [];
  }
};

/**
 * Save an initial price snapshot for a card (if it doesn't exist for today)
 * to ensure we have a data point when a card is first watched or alerted.
 * @param {string} cardId - The card ID.
 * @param {number} currentPrice - The current price of the card.
 * @param {string} [cardName] - Optional card name for metadata.
 * @param {string} [setName] - Optional set name for metadata.
 */
export const saveInitialPriceSnapshot = async (cardId, currentPrice, cardName = '', setName = '') => {
  if (!cardId || !currentPrice || isNaN(currentPrice) || currentPrice <= 0) return;
  
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const snapshotDocRef = doc(db, HISTORY_COLLECTION, cardId, SNAPSHOTS_SUBCOLLECTION, todayStr);
    
    // Check if snapshot already exists for today to avoid overwrite
    const docSnap = await getDoc(snapshotDocRef);
    if (!docSnap.exists()) {
      await setDoc(snapshotDocRef, {
        price: parseFloat(currentPrice),
        date: todayStr,
        timestamp: serverTimestamp(),
        cardId,
        cardName,
        setName
      });
      console.log(`Initial snapshot saved for card ${cardId} on ${todayStr}`);
    }
  } catch (error) {
    console.error(`Error saving initial snapshot for card ${cardId}:`, error);
  }
};

/**
 * Fetches price history snapshots for all cards in parallel, aggregates the total watchlist value by date,
 * and returns a sorted timeline.
 * @param {Array} cards - The list of cards in the watchlist.
 * @returns {Promise<Array>} List of aggregated price history points.
 */
export const fetchRealPortfolioHistory = async (cards) => {
  if (!cards || cards.length === 0) return [];
  
  try {
    // Fetch snapshots for all cards in parallel
    const cardHistories = await Promise.all(
      cards.map(async (card) => {
        const history = await fetchPriceHistory(card.id);
        return {
          card,
          history
        };
      })
    );
    
    // Find all unique dates across all histories
    const uniqueDates = new Set();
    cardHistories.forEach(({ history }) => {
      history.forEach(pt => uniqueDates.add(pt.date));
    });
    
    // If no historical dates exist, default to today
    if (uniqueDates.size === 0) {
      uniqueDates.add(new Date().toISOString().split('T')[0]);
    }
    
    // Convert to sorted array of dates
    const sortedDates = Array.from(uniqueDates).sort();
    
    // Build aggregated value timeline
    const timeline = sortedDates.map(date => {
      let totalValue = 0;
      
      cardHistories.forEach(({ card, history }) => {
        const cardCurrentPrice = card.tcgplayer?.prices?.holofoil?.market ||
                                 card.tcgplayer?.prices?.normal?.market || 0;
                                 
        // Find price on this specific date, or closest preceding date
        const match = history.find(pt => pt.date === date);
        if (match) {
          totalValue += match.price;
        } else {
          // Fallback to the closest preceding price
          const preceding = history
            .filter(pt => pt.date < date)
            .sort((a, b) => b.date.localeCompare(a.date))[0];
            
          if (preceding) {
            totalValue += preceding.price;
          } else {
            // Or the first recorded price (if date is before first recorded point)
            const first = history[0];
            totalValue += first ? first.price : cardCurrentPrice;
          }
        }
      });
      
      return {
        date,
        value: parseFloat(totalValue.toFixed(2)),
        timestamp: new Date(date).getTime()
      };
    });
    
    return timeline;
  } catch (error) {
    console.error('Error fetching real portfolio history:', error);
    return [];
  }
};

/**
 * Computes actual watchlist metrics (net worth, gains/losses, top/bottom performers)
 * based on real Firestore snapshots.
 * @param {Array} cards - The list of cards in the watchlist.
 * @param {number} days - The number of days back to look.
 * @returns {Promise<Object>} The aggregated performance metrics.
 */
export const calculateRealPortfolioMetrics = async (cards, days = 30) => {
  if (!cards || cards.length === 0) {
    return {
      totalValue: 0,
      startValue: 0,
      totalGain: 0,
      totalGainPercent: 0,
      bestPerformer: null,
      worstPerformer: null,
      avgCardValue: 0,
      totalCards: 0,
      performances: []
    };
  }

  try {
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    // Fetch snapshot histories in parallel
    const cardHistories = await Promise.all(
      cards.map(async (card) => {
        const history = await fetchPriceHistory(card.id);
        return { card, history };
      })
    );

    let startValue = 0;
    let currentValue = 0;

    const performances = cardHistories.map(({ card, history }) => {
      const currentPrice = card.tcgplayer?.prices?.holofoil?.market ||
                           card.tcgplayer?.prices?.normal?.market || 0;

      // Find price at the start of the period (closest to cutoffStr)
      let startPrice = currentPrice;
      if (history.length > 0) {
        // Look for exact match or closest preceding/first snapshot in range
        const matchingPoint = history
          .filter(pt => pt.date <= cutoffStr)
          .sort((a, b) => b.date.localeCompare(a.date))[0];

        if (matchingPoint) {
          startPrice = matchingPoint.price;
        } else {
          // If no point is before the cutoff, use the earliest recorded point
          startPrice = history[0].price;
        }
      }

      const gain = currentPrice - startPrice;
      const gainPercent = startPrice > 0 ? (gain / startPrice) * 100 : 0;

      startValue += startPrice;
      currentValue += currentPrice;

      return {
        cardId: card.id,
        cardName: card.name,
        cardImage: card.images?.small || card.images?.large,
        currentPrice,
        startPrice,
        gain: parseFloat(gain.toFixed(2)),
        gainPercent: parseFloat(gainPercent.toFixed(2)),
        isPositive: gain >= 0
      };
    });

    const totalGain = currentValue - startValue;
    const totalGainPercent = startValue > 0 ? (totalGain / startValue) * 100 : 0;

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
      performances
    };
  } catch (error) {
    console.error('Error calculating real portfolio metrics:', error);
    return {
      totalValue: 0,
      startValue: 0,
      totalGain: 0,
      totalGainPercent: 0,
      bestPerformer: null,
      worstPerformer: null,
      avgCardValue: 0,
      totalCards: cards.length,
      performances: []
    };
  }
};
