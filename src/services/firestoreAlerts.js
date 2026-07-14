// Firestore-based Price Alert Service
// Premium service for server-side alert monitoring and email notifications

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { saveInitialPriceSnapshot } from './firestoreHistory';

const ALERTS_COLLECTION = 'priceAlerts';
const ALERT_LOGS_COLLECTION = 'alertLogs';

// Alert structure in Firestore:
// {
//   userId: string,
//   cardId: string,
//   cardName: string,
//   cardImage: string,
//   setName: string,
//   rarity: string,
//   currentPrice: number,
//   targetPrice: number,
//   condition: 'above' | 'below' | 'drops_to' | 'arbitrage',
//   alertType: 'email' | 'push' | 'both',
//   frequency: 'instant' | 'daily' | 'weekly',
//   enabled: boolean,
//   createdAt: timestamp,
//   lastChecked: timestamp,
//   lastTriggered: timestamp | null,
//   triggeredCount: number
// }

/**
 * Create a new price alert in Firestore
 */
export const createAlert = async (alertData, userId) => {
  try {
    // Check if similar alert exists
    const existingAlert = await checkDuplicateAlert(
      userId,
      alertData.cardId,
      alertData.targetPrice,
      alertData.condition
    );

    if (existingAlert) {
      throw new Error('ALERT_EXISTS');
    }

    const alertRef = await addDoc(collection(db, ALERTS_COLLECTION), {
      userId,
      cardId: alertData.cardId,
      cardName: alertData.cardName,
      cardImage: alertData.cardImage,
      setName: alertData.setName || '',
      rarity: alertData.rarity || '',
      currentPrice: parseFloat(alertData.currentPrice),
      targetPrice: parseFloat(alertData.targetPrice),
      condition: alertData.condition,
      alertType: alertData.alertType || 'email',
      frequency: alertData.frequency || 'instant',
      enabled: true,
      createdAt: serverTimestamp(),
      lastChecked: serverTimestamp(),
      lastTriggered: null,
      triggeredCount: 0,
      notificationsSent: 0
    });

    console.log('Alert created in Firestore:', alertRef.id);
    
    // Save initial price snapshot so the history chart starts today
    await saveInitialPriceSnapshot(
      alertData.cardId,
      alertData.currentPrice,
      alertData.cardName,
      alertData.setName
    );

    return { id: alertRef.id, ...alertData };
  } catch (error) {
    console.error('Error creating alert in Firestore:', error);
    throw error;
  }
};

/**
 * Get all alerts for a user
 */
export const getUserAlerts = async (userId) => {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastChecked: doc.data().lastChecked?.toDate(),
        lastTriggered: doc.data().lastTriggered?.toDate()
      });
    });

    return alerts;
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    return [];
  }
};

/**
 * Subscribe to real-time updates for user alerts
 */
export const subscribeToUserAlerts = (userId, callback) => {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alerts = [];
      snapshot.forEach((doc) => {
        alerts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastChecked: doc.data().lastChecked?.toDate(),
          lastTriggered: doc.data().lastTriggered?.toDate()
        });
      });
      callback(alerts);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
    return () => {};
  }
};

/**
 * Get alerts for a specific card
 */
export const getCardAlerts = async (cardId, userId) => {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('userId', '==', userId),
      where('cardId', '==', cardId)
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return alerts;
  } catch (error) {
    console.error('Error fetching card alerts:', error);
    return [];
  }
};

/**
 * Update an existing alert
 */
export const updateAlert = async (alertId, updates) => {
  try {
    const alertRef = doc(db, ALERTS_COLLECTION, alertId);
    await updateDoc(alertRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { id: alertId, ...updates };
  } catch (error) {
    console.error('Error updating alert:', error);
    throw new Error('ALERT_UPDATE_FAILED');
  }
};

/**
 * Toggle alert enabled/disabled
 */
export const toggleAlert = async (alertId) => {
  try {
    const alertRef = doc(db, ALERTS_COLLECTION, alertId);
    const alertDoc = await getDoc(alertRef);

    if (!alertDoc.exists()) {
      throw new Error('ALERT_NOT_FOUND');
    }

    const currentEnabled = alertDoc.data().enabled;

    await updateDoc(alertRef, {
      enabled: !currentEnabled,
      updatedAt: serverTimestamp()
    });

    return { id: alertId, enabled: !currentEnabled };
  } catch (error) {
    console.error('Error toggling alert:', error);
    throw error;
  }
};

/**
 * Delete an alert
 */
export const deleteAlert = async (alertId) => {
  try {
    const alertRef = doc(db, ALERTS_COLLECTION, alertId);
    await deleteDoc(alertRef);
    console.log('Alert deleted:', alertId);
    return true;
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw new Error('ALERT_DELETE_FAILED');
  }
};

/**
 * Check for duplicate alerts
 */
const checkDuplicateAlert = async (userId, cardId, targetPrice, condition) => {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('userId', '==', userId),
      where('cardId', '==', cardId),
      where('targetPrice', '==', parseFloat(targetPrice)),
      where('condition', '==', condition),
      limit(1)
    );

    const snapshot = await getDocs(alertsQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return false;
  }
};

/**
 * Check if user has alert for a card
 */
export const hasAlert = async (cardId, userId) => {
  try {
    const alerts = await getCardAlerts(cardId, userId);
    return alerts.some((a) => a.enabled);
  } catch (error) {
    console.error('Error checking alert existence:', error);
    return false;
  }
};

/**
 * Get alert statistics for a user
 */
export const getAlertStats = async (userId) => {
  try {
    const alerts = await getUserAlerts(userId);

    return {
      total: alerts.length,
      enabled: alerts.filter((a) => a.enabled).length,
      disabled: alerts.filter((a) => !a.enabled).length,
      triggered: alerts.filter((a) => a.lastTriggered !== null).length,
      byCondition: {
        below: alerts.filter((a) => a.condition === 'below').length,
        above: alerts.filter((a) => a.condition === 'above').length,
        drops_to: alerts.filter((a) => a.condition === 'drops_to').length,
        arbitrage: alerts.filter((a) => a.condition === 'arbitrage').length
      },
      totalNotificationsSent: alerts.reduce((sum, a) => sum + (a.notificationsSent || 0), 0)
    };
  } catch (error) {
    console.error('Error getting alert stats:', error);
    return {
      total: 0,
      enabled: 0,
      disabled: 0,
      triggered: 0,
      byCondition: { below: 0, above: 0, drops_to: 0, arbitrage: 0 },
      totalNotificationsSent: 0
    };
  }
};

/**
 * Log alert trigger event
 */
export const logAlertTrigger = async (alertId, alertData, emailSent = false) => {
  try {
    await addDoc(collection(db, ALERT_LOGS_COLLECTION), {
      alertId,
      userId: alertData.userId,
      cardId: alertData.cardId,
      cardName: alertData.cardName,
      oldPrice: alertData.oldPrice,
      newPrice: alertData.newPrice,
      targetPrice: alertData.targetPrice,
      condition: alertData.condition,
      priceChange: alertData.priceChange,
      percentChange: alertData.percentChange,
      emailSent,
      triggeredAt: serverTimestamp()
    });

    // Update alert's trigger count and timestamp
    const alertRef = doc(db, ALERTS_COLLECTION, alertId);
    const alertDoc = await getDoc(alertRef);

    if (alertDoc.exists()) {
      const currentCount = alertDoc.data().notificationsSent || 0;
      await updateDoc(alertRef, {
        lastTriggered: serverTimestamp(),
        lastChecked: serverTimestamp(),
        triggeredCount: (alertDoc.data().triggeredCount || 0) + 1,
        notificationsSent: currentCount + (emailSent ? 1 : 0)
      });
    }
  } catch (error) {
    console.error('Error logging alert trigger:', error);
  }
};

/**
 * Get alert history/logs for a user
 */
export const getAlertLogs = async (userId, limitCount = 50) => {
  try {
    const logsQuery = query(
      collection(db, ALERT_LOGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('triggeredAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(logsQuery);
    const logs = [];

    snapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
        triggeredAt: doc.data().triggeredAt?.toDate()
      });
    });

    return logs;
  } catch (error) {
    console.error('Error fetching alert logs:', error);
    return [];
  }
};

/**
 * Validate alert data before creation
 */
export const validateAlert = (alertData) => {
  const errors = [];

  if (!alertData.cardId) {
    errors.push('Card ID is required');
  }

  if (!alertData.cardName) {
    errors.push('Card name is required');
  }

  if (!alertData.targetPrice || parseFloat(alertData.targetPrice) <= 0) {
    errors.push('Target price must be greater than 0');
  }

  if (!alertData.currentPrice || parseFloat(alertData.currentPrice) <= 0) {
    errors.push('Current price is required');
  }

  if (!['above', 'below', 'drops_to', 'arbitrage'].includes(alertData.condition)) {
    errors.push('Invalid condition');
  }

  if (!['email', 'push', 'both'].includes(alertData.alertType)) {
    errors.push('Invalid alert type');
  }

  if (!['instant', 'daily', 'weekly'].includes(alertData.frequency)) {
    errors.push('Invalid frequency');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Batch update current prices (for backend use)
 */
export const batchUpdateAlertPrices = async (priceUpdates) => {
  try {
    const updatePromises = [];

    for (const [cardId, newPrice] of Object.entries(priceUpdates)) {
      const alertsQuery = query(
        collection(db, ALERTS_COLLECTION),
        where('cardId', '==', cardId),
        where('enabled', '==', true)
      );

      const snapshot = await getDocs(alertsQuery);

      snapshot.forEach((doc) => {
        const alertRef = doc.ref;
        updatePromises.push(
          updateDoc(alertRef, {
            currentPrice: parseFloat(newPrice),
            lastChecked: serverTimestamp()
          })
        );
      });
    }

    await Promise.all(updatePromises);
    console.log(`Updated prices for ${updatePromises.length} alerts`);
    return updatePromises.length;
  } catch (error) {
    console.error('Error batch updating prices:', error);
    throw error;
  }
};

/**
 * Get all enabled alerts (for backend monitoring)
 * This is used by the serverless function to check prices
 */
export const getAllEnabledAlerts = async () => {
  try {
    const alertsQuery = query(
      collection(db, ALERTS_COLLECTION),
      where('enabled', '==', true)
    );

    const snapshot = await getDocs(alertsQuery);
    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Fetched ${alerts.length} enabled alerts`);
    return alerts;
  } catch (error) {
    console.error('Error fetching enabled alerts:', error);
    return [];
  }
};

/**
 * Migrate alerts from localStorage to Firestore
 * Helper function for one-time migration
 */
export const migrateLocalAlertsToFirestore = async (userId, localAlerts) => {
  try {
    const migrationResults = {
      success: 0,
      failed: 0,
      skipped: 0
    };

    for (const alert of localAlerts) {
      try {
        // Check if alert already exists in Firestore
        const exists = await checkDuplicateAlert(
          userId,
          alert.cardId,
          alert.targetPrice,
          alert.condition
        );

        if (exists) {
          migrationResults.skipped++;
          continue;
        }

        // Create alert in Firestore
        await createAlert(alert, userId);
        migrationResults.success++;
      } catch (error) {
        console.error('Failed to migrate alert:', alert.cardName, error);
        migrationResults.failed++;
      }
    }

    console.log('Migration complete:', migrationResults);
    return migrationResults;
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};
