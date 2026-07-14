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
    console.log('Firebase Admin initialized successfully in Movers API');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
  }
}

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // For the MVP Concept Test, we pull popular cards from a recent set (e.g., 151)
    // and simulate 24h market movement to validate user engagement with the feature.
    const response = await fetch(`${POKEMON_TCG_API}/cards?q=set.id:sv3pt5 rarity:"Illustration Rare" OR rarity:"Special Illustration Rare"&pageSize=20`, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Pokemon TCG API Error: ${response.status}`);
    }

    const { data: cardsData } = await response.json();

    const movers = cardsData.map(card => {
      const marketPrice = card.tcgplayer?.prices?.holofoil?.market || 0;
      
      // Simulate a 24h change between -15% and +25% for concept test UI
      // Use card ID hash to keep it deterministic per card for the day
      const hash = card.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
      const todaySeed = new Date().getDate();
      const pseudoRandom = Math.abs(hash * todaySeed) % 40 - 15; // -15 to +25
      
      const previousPrice = marketPrice / (1 + (pseudoRandom / 100));

      return {
        id: card.id,
        name: card.name,
        set: card.set?.name,
        images: {
          small: card.images?.small
        },
        currentPrice: marketPrice,
        previousPrice: previousPrice,
        percentChange: pseudoRandom,
        absoluteChange: marketPrice - previousPrice
      };
    });

    // Sort by largest absolute movement
    movers.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));

    return res.status(200).json({
      success: true,
      data: {
        gainers: movers.filter(m => m.percentChange > 0).slice(0, 10),
        losers: movers.filter(m => m.percentChange < 0).slice(0, 10)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
