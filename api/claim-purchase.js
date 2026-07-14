import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({ success: false, error: 'User has no email' });
    }

    // Check if there are any unclaimed purchases for this email
    const guestPurchasesRef = db.collection('guest_purchases');
    const q = guestPurchasesRef.where('email', '==', email).where('claimed', '==', false);
    const snapshot = await q.get();

    if (snapshot.empty) {
      // Also check if they already have premium in users collection
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists && userDoc.data().isPremium) {
        return res.status(200).json({ success: true, claimed: false, message: 'Already premium' });
      }
      return res.status(200).json({ success: true, claimed: false, message: 'No pending purchases found' });
    }

    // Claim the first found purchase
    const purchaseDoc = snapshot.docs[0];
    
    // Grant premium
    await db.collection('users').doc(uid).set({
      isPremium: true,
      premiumActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
      stripeSessionId: purchaseDoc.id,
      email: email,
      amountPaid: purchaseDoc.data().amountPaid
    }, { merge: true });

    // Mark as claimed
    await purchaseDoc.ref.update({
      claimed: true,
      claimedBy: uid,
      claimedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true, claimed: true });
  } catch (error) {
    console.error('Claim purchase error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
