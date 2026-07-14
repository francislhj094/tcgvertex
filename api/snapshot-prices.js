// Vercel Serverless Function - Daily Price Snapshot Engine
// Fetches current prices for all actively tracked cards (in watchlists or price alerts)
// and saves a daily snapshot in Firestore to build real price history.
// This function should be called by a cron job once per day.

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (if not already initialized)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
  }
}

const db = admin.firestore();

// Pokémon TCG API base URL
const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

/**
 * Fetch details and prices for a batch of card IDs from Pokémon TCG API
 */
async function fetchCardPricesBatch(cardIds) {
  if (!cardIds || cardIds.length === 0) return [];
  
  try {
    const idQuery = cardIds.map(id => `id:"${id}"`).join(' OR ');
    const url = `${POKEMON_TCG_API}/cards?q=(${idQuery})&pageSize=50`;
    
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching price batch:`, error.message);
    return [];
  }
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // Only allow POST requests (triggered by cron)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret for security
  const cronSecret = req.headers['x-cron-secret'];
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();
  console.log('🚀 Starting daily price snapshot process...');

  try {
    const cardIds = new Set();

    // 1. Gather cards from enabled price alerts
    const alertsSnapshot = await db.collection('priceAlerts')
      .where('enabled', '==', true)
      .get();
    
    alertsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.cardId) cardIds.add(data.cardId);
    });

    // 2. Gather cards from users' watchlists (vaults)
    const usersSnapshot = await db.collection('users').get();
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (Array.isArray(data.vault)) {
        data.vault.forEach(id => {
          if (id) cardIds.add(id);
        });
      }
    });

    const deduplicatedCardIds = Array.from(cardIds);
    console.log(`📊 Found ${deduplicatedCardIds.length} unique cards to snapshot`);

    if (deduplicatedCardIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No tracked cards to snapshot',
        cardsTotal: 0,
        cardsSnapshotted: 0,
        duration: Date.now() - startTime
      });
    }

    // 3. Process card IDs in batches to avoid overwhelming the API and URL length limits
    const BATCH_SIZE = 25;
    let snapshottedCount = 0;
    const detailsLog = [];
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    for (let i = 0; i < deduplicatedCardIds.length; i += BATCH_SIZE) {
      const batchIds = deduplicatedCardIds.slice(i, i + BATCH_SIZE);
      const cardsData = await fetchCardPricesBatch(batchIds);
      
      const batchWrites = [];
      cardsData.forEach(card => {
        // Get market price from TCGPlayer
        const marketPrice = card.tcgplayer?.prices?.holofoil?.market ||
                           card.tcgplayer?.prices?.normal?.market ||
                           card.tcgplayer?.prices?.reverseHolofoil?.market ||
                           card.tcgplayer?.prices?.unlimited?.market ||
                           card.tcgplayer?.prices?.['1stEditionHolofoil']?.market ||
                           0;
        
        if (marketPrice > 0) {
          const snapshotRef = db.collection('priceHistory')
            .doc(card.id)
            .collection('snapshots')
            .doc(todayStr);

          // Write snapshot to Firestore
          const writePromise = snapshotRef.set({
            price: marketPrice,
            date: todayStr,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            cardId: card.id,
            cardName: card.name,
            setName: card.set?.name || ''
          }).then(() => {
            snapshottedCount++;
            detailsLog.push({ cardId: card.id, name: card.name, price: marketPrice });
          }).catch(err => {
            console.error(`Failed to write snapshot for ${card.id}:`, err.message);
          });
          
          batchWrites.push(writePromise);
        } else {
          console.log(`⚠️ Price is 0 or missing for ${card.name} (${card.id})`);
        }
      });

      // Wait for all snapshot writes in the current batch to complete
      await Promise.allSettled(batchWrites);

      // Add a small delay between batches to respect API limits
      if (i + BATCH_SIZE < deduplicatedCardIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Daily snapshot complete. Snapshotted ${snapshottedCount}/${deduplicatedCardIds.length} cards in ${duration}ms`);

    // 4. Log the snapshot execution history
    await db.collection('snapshotLogs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      cardsTotal: deduplicatedCardIds.length,
      cardsSnapshotted: snapshottedCount,
      duration: duration,
      details: detailsLog
    });

    return res.status(200).json({
      success: true,
      cardsTotal: deduplicatedCardIds.length,
      cardsSnapshotted: snapshottedCount,
      duration,
      today: todayStr
    });

  } catch (error) {
    console.error('❌ Error executing daily snapshot cron:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      duration: Date.now() - startTime
    });
  }
}
