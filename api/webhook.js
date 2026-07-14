// Vercel Serverless Function - Stripe Webhook Handler
import Stripe from 'stripe';
import admin from 'firebase-admin';

// CRITICAL: Use environment variable, never hardcode keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin SDK
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

// Webhook signing secret (you'll set this up in Stripe Dashboard)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } else {
      event = JSON.parse(buf.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Payment was successful
      console.log('Payment successful:', {
        sessionId: session.id,
        userId: session.client_reference_id || session.metadata.userId,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total / 100, // Convert from cents
      });

      // Update user's premium status in Firebase
      try {
        const userId = session.client_reference_id || session.metadata.userId;

        if (!userId) {
          console.error('No userId found in session');
          break;
        }

        await db.collection('users').doc(userId).set({
          isPremium: true,
          premiumActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id,
          email: session.customer_email,
          amountPaid: session.amount_total / 100
        }, { merge: true });

        console.log(`Successfully updated premium status for user: ${userId}`);
      } catch (error) {
        console.error('Failed to update Firestore:', error.message);
      }

      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
}
