// src/services/api.js

const BASE_URL = 'https://api.pokemontcg.io/v2';

/**
 * Wraps a TCGplayer URL with our affiliate parameters (if configured in the future).
 * Best Practice: Impact Radius or TCGplayer affiliate IDs are usually appended as query params.
 */
export const buildAffiliateLink = (rawUrl) => {
  if (!rawUrl) return '#';
  
  // Example of how we will inject the affiliate ID later:
  // const AFFILIATE_ID = 'your_id_here';
  // const url = new URL(rawUrl);
  // url.searchParams.set('partner', AFFILIATE_ID);
  // url.searchParams.set('utm_campaign', 'affiliate');
  // return url.toString();

  return rawUrl; // Returning raw URL for now as requested for MVP
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
