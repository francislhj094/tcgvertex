// Price Alert Service
// Manages user price alerts and notifications

const ALERTS_KEY = 'price_alerts';

// Alert structure:
// {
//   id: unique_id,
//   cardId: card_id,
//   cardName: card_name,
//   cardImage: image_url,
//   userId: user_id (optional),
//   targetPrice: number,
//   currentPrice: number,
//   condition: 'above' | 'below' | 'drops_to',
//   alertType: 'email' | 'push' | 'both',
//   frequency: 'instant' | 'daily' | 'weekly',
//   enabled: boolean,
//   createdAt: timestamp,
//   lastChecked: timestamp,
//   lastTriggered: timestamp (null if never triggered)
// }

// Get all alerts for a user
export const getAlerts = (userId = null) => {
  try {
    const key = userId ? `${ALERTS_KEY}_${userId}` : ALERTS_KEY;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get alerts:', e);
    return [];
  }
};

// Save alerts for a user
const saveAlerts = (alerts, userId = null) => {
  try {
    const key = userId ? `${ALERTS_KEY}_${userId}` : ALERTS_KEY;
    localStorage.setItem(key, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts:', e);
  }
};

// Create a new price alert
export const createAlert = (alertData, userId = null) => {
  const alerts = getAlerts(userId);

  // Check if alert already exists for this card
  const existing = alerts.find(a =>
    a.cardId === alertData.cardId &&
    a.targetPrice === alertData.targetPrice &&
    a.condition === alertData.condition
  );

  if (existing) {
    throw new Error('ALERT_EXISTS');
  }

  const newAlert = {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...alertData,
    userId: userId,
    enabled: true,
    createdAt: Date.now(),
    lastChecked: Date.now(),
    lastTriggered: null
  };

  alerts.push(newAlert);
  saveAlerts(alerts, userId);

  return newAlert;
};

// Update an existing alert
export const updateAlert = (alertId, updates, userId = null) => {
  const alerts = getAlerts(userId);
  const index = alerts.findIndex(a => a.id === alertId);

  if (index === -1) {
    throw new Error('ALERT_NOT_FOUND');
  }

  alerts[index] = {
    ...alerts[index],
    ...updates,
    updatedAt: Date.now()
  };

  saveAlerts(alerts, userId);
  return alerts[index];
};

// Delete an alert
export const deleteAlert = (alertId, userId = null) => {
  const alerts = getAlerts(userId);
  const filtered = alerts.filter(a => a.id !== alertId);
  saveAlerts(filtered, userId);
  return true;
};

// Toggle alert enabled/disabled
export const toggleAlert = (alertId, userId = null) => {
  const alerts = getAlerts(userId);
  const index = alerts.findIndex(a => a.id === alertId);

  if (index === -1) {
    throw new Error('ALERT_NOT_FOUND');
  }

  alerts[index].enabled = !alerts[index].enabled;
  saveAlerts(alerts, userId);
  return alerts[index];
};

// Get alerts for a specific card
export const getCardAlerts = (cardId, userId = null) => {
  const alerts = getAlerts(userId);
  return alerts.filter(a => a.cardId === cardId);
};

// Check if user has alert for a card
export const hasAlert = (cardId, userId = null) => {
  const alerts = getCardAlerts(cardId, userId);
  return alerts.some(a => a.enabled);
};

// Check alerts and determine which ones should trigger
export const checkAlerts = (alerts, currentPrices) => {
  const triggered = [];

  alerts.forEach(alert => {
    if (!alert.enabled) return;

    const currentPrice = currentPrices[alert.cardId];
    if (!currentPrice) return;

    let shouldTrigger = false;

    switch (alert.condition) {
      case 'below':
        shouldTrigger = currentPrice < alert.targetPrice;
        break;
      case 'above':
        shouldTrigger = currentPrice > alert.targetPrice;
        break;
      case 'drops_to':
        // Trigger only if price dropped from above to below target
        shouldTrigger = currentPrice <= alert.targetPrice && alert.currentPrice > alert.targetPrice;
        break;
      default:
        break;
    }

    if (shouldTrigger) {
      // Check frequency to avoid spam
      const timeSinceLastTrigger = Date.now() - (alert.lastTriggered || 0);
      const frequencyMs = {
        'instant': 0,
        'daily': 24 * 60 * 60 * 1000,
        'weekly': 7 * 24 * 60 * 60 * 1000
      };

      const minInterval = frequencyMs[alert.frequency] || 0;

      if (timeSinceLastTrigger >= minInterval) {
        triggered.push({
          ...alert,
          newPrice: currentPrice,
          priceDrop: alert.currentPrice - currentPrice,
          percentDrop: ((alert.currentPrice - currentPrice) / alert.currentPrice * 100).toFixed(2)
        });
      }
    }
  });

  return triggered;
};

// Mark alerts as triggered
export const markAlertsTriggered = (alertIds, userId = null) => {
  const alerts = getAlerts(userId);
  const now = Date.now();

  alertIds.forEach(id => {
    const index = alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      alerts[index].lastTriggered = now;
      alerts[index].lastChecked = now;
    }
  });

  saveAlerts(alerts, userId);
};

// Update current prices in alerts
export const updateAlertPrices = (cardId, newPrice, userId = null) => {
  const alerts = getAlerts(userId);
  let updated = false;

  alerts.forEach(alert => {
    if (alert.cardId === cardId) {
      alert.currentPrice = newPrice;
      alert.lastChecked = Date.now();
      updated = true;
    }
  });

  if (updated) {
    saveAlerts(alerts, userId);
  }
};

// Get alert statistics
export const getAlertStats = (userId = null) => {
  const alerts = getAlerts(userId);

  return {
    total: alerts.length,
    enabled: alerts.filter(a => a.enabled).length,
    disabled: alerts.filter(a => !a.enabled).length,
    triggered: alerts.filter(a => a.lastTriggered !== null).length,
    byCondition: {
      below: alerts.filter(a => a.condition === 'below').length,
      above: alerts.filter(a => a.condition === 'above').length,
      drops_to: alerts.filter(a => a.condition === 'drops_to').length
    }
  };
};

// Validate alert data
export const validateAlert = (alertData) => {
  const errors = [];

  if (!alertData.cardId) {
    errors.push('Card ID is required');
  }

  if (!alertData.cardName) {
    errors.push('Card name is required');
  }

  if (!alertData.targetPrice || alertData.targetPrice <= 0) {
    errors.push('Target price must be greater than 0');
  }

  if (!alertData.currentPrice || alertData.currentPrice <= 0) {
    errors.push('Current price is required');
  }

  if (!['above', 'below', 'drops_to'].includes(alertData.condition)) {
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

// Format alert for email
export const formatAlertEmail = (alert) => {
  const priceChange = alert.currentPrice - alert.newPrice;
  const percentChange = ((priceChange / alert.currentPrice) * 100).toFixed(2);

  return {
    subject: `🔔 Price Alert: ${alert.cardName}`,
    cardName: alert.cardName,
    cardImage: alert.cardImage,
    oldPrice: alert.currentPrice.toFixed(2),
    newPrice: alert.newPrice.toFixed(2),
    targetPrice: alert.targetPrice.toFixed(2),
    priceChange: priceChange.toFixed(2),
    percentChange: percentChange,
    condition: alert.condition,
    isGoodNews: priceChange > 0 && alert.condition === 'below',
    timestamp: new Date().toLocaleString()
  };
};

// Export all alerts as JSON (for backup)
export const exportAlerts = (userId = null) => {
  const alerts = getAlerts(userId);
  const exportData = {
    alerts,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };

  return JSON.stringify(exportData, null, 2);
};

// Import alerts from JSON
export const importAlerts = (jsonData, userId = null) => {
  try {
    const data = JSON.parse(jsonData);
    const existingAlerts = getAlerts(userId);

    // Merge imported alerts with existing ones (avoid duplicates)
    const mergedAlerts = [...existingAlerts];

    data.alerts.forEach(importedAlert => {
      const exists = existingAlerts.some(a =>
        a.cardId === importedAlert.cardId &&
        a.targetPrice === importedAlert.targetPrice
      );

      if (!exists) {
        mergedAlerts.push({
          ...importedAlert,
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userId
        });
      }
    });

    saveAlerts(mergedAlerts, userId);
    return { success: true, imported: mergedAlerts.length - existingAlerts.length };
  } catch (e) {
    console.error('Failed to import alerts:', e);
    return { success: false, error: e.message };
  }
};
