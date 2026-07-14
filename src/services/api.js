// src/services/api.js

const BASE_URL = 'https://api.pokemontcg.io/v2';

/**
 * Wraps a TCGplayer URL with affiliate parameters for revenue tracking
 * Supports TCGPlayer Partner Network affiliate tracking
 */
export const buildAffiliateLink = (rawUrl) => {
  if (!rawUrl) return '#';

  // Get affiliate ID from environment variable
  const AFFILIATE_ID = import.meta.env.VITE_TCGPLAYER_AFFILIATE_ID;

  // If no affiliate ID configured, return raw URL
  if (!AFFILIATE_ID) {
    console.warn('TCGPlayer affiliate ID not configured. Set VITE_TCGPLAYER_AFFILIATE_ID in environment variables.');
    return rawUrl;
  }

  try {
    // Modern Impact.com affiliate link wrapping format
    // TCGPlayer program campaign ID is 21018, default link ID is 1780961
    return `https://partner.tcgplayer.com/c/${AFFILIATE_ID}/1780961/21018?u=${encodeURIComponent(rawUrl)}`;
  } catch (error) {
    console.error('Error building affiliate link:', error);
    return rawUrl;
  }
};

export const fetchTrendingCards = async () => {
  try {
    // Fetch some high-value cards from a popular modern set (e.g., sv3pt5 which is Pokemon 151)
    // We sort by holofoil market price descending to get the "chasers"
    const response = await fetch(`${BASE_URL}/cards?q=set.id:sv3pt5&orderBy=-tcgplayer.prices.holofoil.market&pageSize=8`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching trending cards:", error);
    return [];
  }
};

export const searchCards = async (query = '', page = 1) => {
  try {
    let qParam = '';
    if (query) {
      // Fuzzy match on name
      qParam = `q=name:"*${query}*"`;
    } else {
      // If no query, just fetch some high value cards
      qParam = `q=supertype:Pokémon`;
    }
    
    const response = await fetch(`${BASE_URL}/cards?${qParam}&orderBy=-tcgplayer.prices.holofoil.market&pageSize=12&page=${page}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching cards:", error);
    return [];
  }
};

export const fetchCardById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching card by id:", error);
    return null;
  }
};

export const fetchSets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sets?orderBy=-releaseDate&pageSize=50`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching sets:", error);
    return [];
  }
};

export const fetchCardsBySet = async (setId, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/cards?q=set.id:${setId}&orderBy=-tcgplayer.prices.holofoil.market&pageSize=20&page=${page}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching cards by set:", error);
    return [];
  }
};

export const fetchCardsByIds = async (ids) => {
  if (!ids.length) return [];
  try {
    // Fetch in batches of 10 to avoid URL length limits
    const batches = [];
    for (let i = 0; i < ids.length; i += 10) {
      batches.push(ids.slice(i, i + 10));
    }
    
    const results = [];
    for (const batch of batches) {
      const idQuery = batch.map(id => `id:"${id}"`).join(' OR ');
      const response = await fetch(`${BASE_URL}/cards?q=(${idQuery})&pageSize=50`);
      const data = await response.json();
      if (data.data) results.push(...data.data);
    }
    return results;
  } catch (error) {
    console.error("Error fetching cards by ids:", error);
    return [];
  }
};

/**
 * Wraps an eBay search query for a card with affiliate parameters for EPN (eBay Partner Network)
 */
export const buildEbayAffiliateLink = (cardName) => {
  if (!cardName) return '#';
  
  const query = `${cardName} pokemon card`;
  const baseSearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=0`;
  
  const CAMPID = import.meta.env.VITE_EBAY_CAMPID;
  if (!CAMPID) {
    console.warn('eBay campaign ID not configured. Returning standard search URL.');
    return baseSearchUrl;
  }
  
  try {
    // EPN link wrapping format
    return `https://rover.ebay.com/rover/1/711-53200-19255-0/1?mpre=${encodeURIComponent(baseSearchUrl)}&campid=${CAMPID}&toolid=10001&customid=pokeprice`;
  } catch (error) {
    console.error('Error building eBay affiliate link:', error);
    return baseSearchUrl;
  }
};

/**
 * Builds a search link for Cardmarket, optionally wrapping it with a referrer ID
 */
export const buildCardmarketAffiliateLink = (cardName) => {
  if (!cardName) return '#';
  
  const baseSearchUrl = `https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodeURIComponent(cardName)}`;
  
  const REFERRER = import.meta.env.VITE_CARDMARKET_REFERRER;
  if (!REFERRER) {
    return baseSearchUrl;
  }
  
  try {
    return `${baseSearchUrl}&referrer=${encodeURIComponent(REFERRER)}`;
  } catch (error) {
    console.error('Error building Cardmarket affiliate link:', error);
    return baseSearchUrl;
  }
};
