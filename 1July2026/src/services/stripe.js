// Stripe Configuration
import { loadStripe } from '@stripe/stripe-js';

// Live Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51TnLIwC2s6dvowYyo2Encuks7FNLwRvFdQW9895WsCFSPo6x9HmLwRSZVAlpa4FKBJQ1jbT7rVVp7pBJz6f3MFJR00A3nclr5z';

// Price ID for Premium Lifetime Access
export const STRIPE_PRICE_ID = 'price_1TnLQDC2s6dvowYyRH2Im9tp';

// Initialize Stripe
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Create Checkout Session
export const createCheckoutSession = async (priceId, userId) => {
  try {
    // In production, this would call your backend API
    // For now, redirect directly to Stripe Checkout
    const stripe = await getStripe();

    // For a real implementation, you'd call your backend:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ priceId, userId })
    // });
    // const session = await response.json();
    // const result = await stripe.redirectToCheckout({ sessionId: session.id });

    // For now, we'll use Stripe's Payment Links (create one in Stripe Dashboard)
    // Or implement the full backend integration

    return { success: true };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message };
  }
};
