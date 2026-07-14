// Facebook Pixel tracking helper
// This provides type-safe, centralized Facebook Pixel event tracking

/**
 * Track when user views a specific page/content
 * @param {string} contentName - Name of the content being viewed
 * @param {string} contentCategory - Category of the content
 * @param {number} value - Monetary value (optional)
 * @param {string} currency - Currency code (default: USD)
 */
export const trackViewContent = (contentName, contentCategory, value = null, currency = 'USD') => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData = {
      content_name: contentName,
      content_category: contentCategory
    };

    // Only include value if provided
    if (value !== null) {
      eventData.value = value;
      eventData.currency = currency;
    }

    window.fbq('track', 'ViewContent', eventData);
    console.log('[FB Pixel] ViewContent:', eventData);
  }
};

/**
 * Track when user initiates checkout process
 * @param {string} contentName - What they're purchasing
 * @param {number} value - Price
 * @param {string} currency - Currency code
 */
export const trackInitiateCheckout = (contentName, value, currency = 'USD') => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData = {
      content_name: contentName,
      value: value,
      currency: currency,
      num_items: 1
    };

    window.fbq('track', 'InitiateCheckout', eventData);
    console.log('[FB Pixel] InitiateCheckout:', eventData);
  }
};

/**
 * Track completed purchase
 * @param {number} value - Purchase amount
 * @param {string} currency - Currency code
 * @param {string} transactionId - Unique transaction/session ID
 */
export const trackPurchase = (value, currency = 'USD', transactionId = null) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData = {
      value: value,
      currency: currency,
      content_type: 'product',
      content_name: 'Premium Lifetime Access'
    };

    // Include transaction ID if provided (helps prevent duplicate tracking)
    if (transactionId) {
      eventData.transaction_id = transactionId;
    }

    window.fbq('track', 'Purchase', eventData);
    console.log('[FB Pixel] Purchase:', eventData);
  }
};

/**
 * Track when user adds item to cart/watchlist
 * @param {string} contentName - Item name
 * @param {number} value - Item value (optional)
 * @param {string} currency - Currency code
 */
export const trackAddToCart = (contentName, value = null, currency = 'USD') => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventData = {
      content_name: contentName,
      content_type: 'product'
    };

    if (value !== null) {
      eventData.value = value;
      eventData.currency = currency;
    }

    window.fbq('track', 'AddToCart', eventData);
    console.log('[FB Pixel] AddToCart:', eventData);
  }
};

/**
 * Track lead generation (email signup, account creation)
 * @param {string} contentName - What they signed up for
 */
export const trackLead = (contentName) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: contentName
    });
    console.log('[FB Pixel] Lead:', contentName);
  }
};

/**
 * Track custom event
 * @param {string} eventName - Custom event name
 * @param {object} params - Event parameters
 */
export const trackCustomEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
    console.log(`[FB Pixel] Custom Event (${eventName}):`, params);
  }
};

export default {
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
  trackAddToCart,
  trackLead,
  trackCustomEvent
};
