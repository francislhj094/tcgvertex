// Vercel Serverless Function - Price Alert Monitor
// Checks all active alerts and triggers email notifications when conditions are met
// This function should be called by a cron job every 15 minutes

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
 * Fetch current price for a card from Pokémon TCG API
 */
async function fetchCardPrice(cardId) {
  try {
    const response = await fetch(`${POKEMON_TCG_API}/cards/${cardId}`, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const card = data.data;

    // Get market price from TCGPlayer
    const marketPrice = card.tcgplayer?.prices?.holofoil?.market ||
                       card.tcgplayer?.prices?.normal?.market ||
                       card.tcgplayer?.prices?.reverseHolofoil?.market ||
                       card.tcgplayer?.prices?.unlimited?.market ||
                       card.tcgplayer?.prices?.['1stEditionHolofoil']?.market ||
                       0;

    return {
      cardId,
      currentPrice: marketPrice,
      cardName: card.name,
      cardImage: card.images?.small || card.images?.large,
      setName: card.set?.name || '',
      rarity: card.rarity || '',
      cardData: card
    };
  } catch (error) {
    console.error(`Error fetching price for card ${cardId}:`, error.message);
    return null;
  }
}

/**
 * Check if alert condition is met
 */
function checkAlertCondition(alert, currentPrice, cardData) {
  const { condition, targetPrice, currentPrice: oldPrice } = alert;

  switch (condition) {
    case 'below':
      return currentPrice < targetPrice;

    case 'above':
      return currentPrice > targetPrice;

    case 'drops_to':
      // Only trigger if price dropped from above target to below/at target
      return currentPrice <= targetPrice && oldPrice > targetPrice;

    case 'arbitrage':
      // targetPrice represents the discount percentage (e.g. 20 for 20%)
      if (!cardData) return false;
      const marketPrice = currentPrice; 
      // Get the lowest listed price
      const lowPrice = cardData.tcgplayer?.prices?.holofoil?.low || 
                       cardData.tcgplayer?.prices?.normal?.low || 
                       cardData.tcgplayer?.prices?.reverseHolofoil?.low || 
                       cardData.tcgplayer?.prices?.unlimited?.low || 
                       cardData.tcgplayer?.prices?.['1stEditionHolofoil']?.low || 
                       marketPrice;
      
      const thresholdPrice = marketPrice * (1 - (targetPrice / 100));
      return lowPrice <= thresholdPrice && lowPrice > 0;

    default:
      return false;
  }
}

/**
 * Check if alert should be triggered based on frequency settings
 */
function shouldTriggerAlert(alert) {
  const { frequency, lastTriggered } = alert;

  // If never triggered before, always allow
  if (!lastTriggered) {
    return true;
  }

  const now = Date.now();
  const lastTriggerTime = lastTriggered.toMillis ? lastTriggered.toMillis() : lastTriggered;
  const timeSinceLastTrigger = now - lastTriggerTime;

  const frequencyMs = {
    'instant': 0, // No cooldown
    'daily': 24 * 60 * 60 * 1000, // 24 hours
    'weekly': 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  const minInterval = frequencyMs[frequency] || 0;

  return timeSinceLastTrigger >= minInterval;
}

/**
 * Send alert email via internal API
 */
async function sendAlertEmail(alert, currentPrice, userEmail) {
  try {
    const priceChange = alert.currentPrice - currentPrice;
    const percentChange = (priceChange / alert.currentPrice) * 100;

    const alertData = {
      cardId: alert.cardId,
      cardName: alert.cardName,
      cardImage: alert.cardImage,
      setName: alert.setName,
      rarity: alert.rarity,
      oldPrice: alert.currentPrice,
      newPrice: currentPrice,
      targetPrice: alert.targetPrice,
      condition: alert.condition,
      priceChange: priceChange,
      percentChange: percentChange,
      alertFrequency: alert.frequency
    };

    const appUrl = process.env.VITE_APP_URL || 'https://pokeprice.app';
    const emailApiUrl = `${appUrl}/api/send-alert-email`;

    const response = await fetch(emailApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.INTERNAL_API_KEY || ''
      },
      body: JSON.stringify({
        alertId: alert.id,
        userId: alert.userId,
        userEmail: userEmail,
        alertData: alertData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Email API error: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Email sent for alert ${alert.id}: ${alert.cardName}`);
    return result;

  } catch (error) {
    console.error(`❌ Failed to send email for alert ${alert.id}:`, error.message);
    throw error;
  }
}

/**
 * Process a single alert
 */
async function processAlert(alert) {
  try {
    // Fetch current price
    const priceData = await fetchCardPrice(alert.cardId);

    if (!priceData || priceData.currentPrice === 0) {
      console.log(`⚠️ Could not fetch price for ${alert.cardName}, skipping...`);
      return { processed: false, reason: 'price_fetch_failed' };
    }

    const currentPrice = priceData.currentPrice;

    // Update current price in alert document
    await db.collection('priceAlerts').doc(alert.id).update({
      currentPrice: currentPrice,
      lastChecked: admin.firestore.FieldValue.serverTimestamp()
    });

    // Check if condition is met
    const conditionMet = checkAlertCondition(alert, currentPrice, priceData.cardData);

    if (!conditionMet) {
      return { processed: true, triggered: false, reason: 'condition_not_met' };
    }

    // Check frequency restriction
    const shouldTrigger = shouldTriggerAlert(alert);

    if (!shouldTrigger) {
      return { processed: true, triggered: false, reason: 'frequency_restriction' };
    }

    // Get user email
    const userDoc = await db.collection('users').doc(alert.userId).get();

    if (!userDoc.exists) {
      console.log(`⚠️ User ${alert.userId} not found`);
      return { processed: false, reason: 'user_not_found' };
    }

    const userData = userDoc.data();

    if (!userData.isPremium) {
      console.log(`⚠️ User ${alert.userId} is not premium, disabling alert`);
      await db.collection('priceAlerts').doc(alert.id).update({ enabled: false });
      return { processed: false, reason: 'user_not_premium' };
    }

    const userEmail = userData.email;

    if (!userEmail) {
      console.log(`⚠️ No email for user ${alert.userId}`);
      return { processed: false, reason: 'no_email' };
    }

    // Send email notification
    await sendAlertEmail(alert, currentPrice, userEmail);

    return {
      processed: true,
      triggered: true,
      cardName: alert.cardName,
      oldPrice: alert.currentPrice,
      newPrice: currentPrice,
      userEmail: userEmail
    };

  } catch (error) {
    console.error(`Error processing alert ${alert.id}:`, error.message);
    return { processed: false, error: error.message };
  }
}

/**
 * Main monitoring function
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
  console.log('🚀 Starting price alert monitor...');

  try {
    // Fetch all enabled alerts
    const alertsSnapshot = await db.collection('priceAlerts')
      .where('enabled', '==', true)
      .get();

    if (alertsSnapshot.empty) {
      console.log('ℹ️ No enabled alerts found');
      return res.status(200).json({
        success: true,
        message: 'No alerts to process',
        alertsChecked: 0,
        alertsTriggered: 0,
        duration: Date.now() - startTime
      });
    }

    const alerts = [];
    alertsSnapshot.forEach(doc => {
      alerts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📊 Found ${alerts.length} enabled alerts to check`);

    // Process alerts in batches to avoid overwhelming the API
    const BATCH_SIZE = 10;
    const results = {
      total: alerts.length,
      processed: 0,
      triggered: 0,
      failed: 0,
      skipped: 0,
      details: []
    };

    for (let i = 0; i < alerts.length; i += BATCH_SIZE) {
      const batch = alerts.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map(alert => processAlert(alert))
      );

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const processResult = result.value;

          if (processResult.processed) {
            results.processed++;

            if (processResult.triggered) {
              results.triggered++;
              results.details.push({
                cardName: processResult.cardName,
                userEmail: processResult.userEmail,
                oldPrice: processResult.oldPrice,
                newPrice: processResult.newPrice
              });
            }
          } else {
            results.skipped++;
          }
        } else {
          results.failed++;
          console.error(`Alert processing failed:`, result.reason);
        }
      });

      // Add a small delay between batches to be respectful to the API
      if (i + BATCH_SIZE < alerts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const duration = Date.now() - startTime;

    console.log('✅ Price alert monitor completed');
    console.log(`   Total alerts: ${results.total}`);
    console.log(`   Processed: ${results.processed}`);
    console.log(`   Triggered: ${results.triggered}`);
    console.log(`   Failed: ${results.failed}`);
    console.log(`   Skipped: ${results.skipped}`);
    console.log(`   Duration: ${duration}ms`);

    // Log monitoring run to Firestore
    await db.collection('monitoringLogs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      alertsChecked: results.total,
      alertsTriggered: results.triggered,
      alertsFailed: results.failed,
      alertsSkipped: results.skipped,
      duration: duration,
      details: results.details
    });

    return res.status(200).json({
      success: true,
      ...results,
      duration
    });

  } catch (error) {
    console.error('❌ Error in price monitor:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      duration: Date.now() - startTime
    });
  }
}
