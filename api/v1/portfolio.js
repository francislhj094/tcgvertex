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
    console.log('Firebase Admin initialized successfully in API');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
  }
}

const db = admin.firestore();
const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'Missing x-api-key header' });
  }

  try {
    // Check API Key
    const apiKeysSnapshot = await db.collection('apiKeys')
      .where('apiKey', '==', apiKey)
      .limit(1)
      .get();

    if (apiKeysSnapshot.empty) {
      return res.status(401).json({ success: false, error: 'Invalid API Key' });
    }

    const keyDoc = apiKeysSnapshot.docs[0];
    const keyData = keyDoc.data();
    const userId = keyData.userId;

    // Increment usage
    await keyDoc.ref.update({
      usageCount: admin.firestore.FieldValue.increment(1),
      lastUsed: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get user's vault
    const vaultDoc = await db.collection('vaults').doc(userId).get();
    let cardIds = [];
    if (vaultDoc.exists) {
      cardIds = vaultDoc.data().cardIds || [];
    }

    if (cardIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          cards: [],
          totalValue: 0,
          count: 0
        }
      });
    }

    // Fetch card details from Pokemon TCG API
    const idsQuery = cardIds.map(id => `id:${id}`).join(' OR ');
    const response = await fetch(`${POKEMON_TCG_API}/cards?q=(${idsQuery})`, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Pokemon TCG API Error: ${response.status}`);
    }

    const { data: cardsData } = await response.json();

    let totalValue = 0;
    const cards = cardsData.map(card => {
      const marketPrice = card.tcgplayer?.prices?.holofoil?.market ||
                          card.tcgplayer?.prices?.normal?.market ||
                          card.tcgplayer?.prices?.reverseHolofoil?.market ||
                          card.tcgplayer?.prices?.unlimited?.market ||
                          card.tcgplayer?.prices?.['1stEditionHolofoil']?.market ||
                          0;
      totalValue += marketPrice;

      return {
        id: card.id,
        name: card.name,
        set: card.set?.name,
        rarity: card.rarity,
        marketPrice,
        images: {
          small: card.images?.small,
          large: card.images?.large
        }
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        cards,
        totalValue,
        count: cards.length
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
