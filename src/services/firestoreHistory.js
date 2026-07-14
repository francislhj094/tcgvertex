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
