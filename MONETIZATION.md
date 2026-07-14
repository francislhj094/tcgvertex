# Monetization Setup Guide

This guide walks you through setting up the three revenue streams for PokéPrice Tracker.

## 1. TCGPlayer Affiliate Program

### Sign Up
1. Go to https://www.tcgplayer.com/partners
2. Apply for the TCGPlayer Affiliate Program
3. Wait for approval (usually 1-3 business days)
4. Get your Partner ID from the dashboard

### Implementation
Update `src/services/api.js`:

```javascript
export const buildAffiliateLink = (rawUrl) => {
  if (!rawUrl) return '#';
  
  const TCGPLAYER_PARTNER_ID = 'YOUR_PARTNER_ID'; // Replace with your ID
  
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('partner', TCGPLAYER_PARTNER_ID);
    url.searchParams.set('utm_source', 'pokeprice-tracker');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', 'card-page');
    return url.toString();
  } catch (e) {
    return rawUrl;
  }
};
```

### Expected Revenue
- Commission: 1-3% per sale
- Average order: $50-150
- Target CTR: 8-12%
- Monthly estimate (1000 users): $200-500

## 2. eBay Partner Network

### Sign Up
1. Go to https://partnernetwork.ebay.com/
2. Create an account
3. Get your Campaign ID
4. Generate affiliate links for Pokémon TCG searches

### Implementation
Add to `src/services/api.js`:

```javascript
export const buildEbayLink = (cardName) => {
  const EBAY_CAMPAIGN_ID = 'YOUR_CAMPAIGN_ID';
  const searchQuery = encodeURIComponent(`${cardName} Pokemon card`);
  
  return `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}&_sacat=0&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=${EBAY_CAMPAIGN_ID}&customid=&toolid=10001&mkevt=1`;
};
```

Use it in CardDetailPage.jsx:
```javascript
<a href={buildEbayLink(card.name)} className="btn-outline">
  Check eBay Prices
</a>
```

### Expected Revenue
- Commission: 1-4% per sale (varies by category)
- Average order: $30-100
- Target CTR: 5-8%
- Monthly estimate (1000 users): $100-300

## 3. Google AdSense

### Sign Up
1. Go to https://www.google.com/adsense/
2. Apply with your domain
3. Wait for approval (1-2 weeks)
4. Get your AdSense Publisher ID

### Implementation

#### Step 1: Add AdSense Script to `index.html`
```html
<head>
  <!-- ... other tags ... -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossorigin="anonymous"></script>
</head>
```

#### Step 2: Create Ad Component
Create `src/components/AdUnit.jsx`:

```javascript
import React, { useEffect } from 'react';

const AdUnit = ({ slot, format = 'auto', responsive = true }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default AdUnit;
```

#### Step 3: Place Ads in MarketDashboard
Update `src/pages/MarketDashboard.jsx`:

```javascript
import AdUnit from '../components/AdUnit';

// In sidebar, after filters
<div className="glass-panel" style={{ padding: '16px', marginTop: '16px' }}>
  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
    Advertisement
  </p>
  <AdUnit slot="YOUR_SIDEBAR_SLOT_ID" format="rectangle" />
</div>

// In main content, every 8 cards
{cards.map((card, index) => (
  <React.Fragment key={card.id}>
    <CardDisplay {...card} />
    {(index + 1) % 8 === 0 && (
      <div className="glass-panel" style={{ 
        padding: '16px', 
        gridColumn: 'span 2',
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Advertisement
        </p>
        <AdUnit slot="YOUR_INLINE_SLOT_ID" format="horizontal" />
      </div>
    )}
  </React.Fragment>
))}
```

### Expected Revenue
- CPM: $2-8 (depends on traffic quality)
- Target: 3-5 ad impressions per user session
- Monthly estimate (1000 users, 3 pageviews each): $50-200

### Best Practices
- Don't overload pages with ads (max 3 per page)
- Place ads naturally in content flow
- Hide ads for premium users
- Use responsive ad units for mobile

## 4. Premium Subscriptions (Stripe)

### Setup Stripe

1. Sign up at https://stripe.com
2. Get your API keys (test and live)
3. Create a product in Stripe Dashboard:
   - Name: "Premium Membership"
   - Price: $4.99/month recurring
   - Get the Price ID (starts with `price_`)

### Environment Variables
Create `.env.local`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
VITE_STRIPE_PRICE_ID=price_YOUR_PRICE_ID
```

### Implementation

#### Step 1: Install Stripe
```bash
npm install @stripe/stripe-js
```

#### Step 2: Create Checkout Component
Create `src/components/PremiumCheckout.jsx`:

```javascript
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PremiumCheckout = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    // Call your backend to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
      }),
    });
    
    const session = await response.json();
    
    // Redirect to Stripe Checkout
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button className="btn-primary" onClick={handleCheckout}>
      Upgrade to Premium - $4.99/mo
    </button>
  );
};

export default PremiumCheckout;
```

#### Step 3: Backend API (Netlify/Vercel Function)
Create `netlify/functions/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { priceId } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Expected Revenue
- Price: $4.99/month
- Target conversion: 2-3% of active users
- Monthly estimate (1000 users): $100-150 MRR
- **Year 1 Target**: 50 subscribers = $250/month MRR

## 5. Revenue Projections

### Month 1 (1,000 users)
- Affiliate (TCGPlayer + eBay): $300-800
- AdSense: $50-200
- Premium (0 subscribers): $0
- **Total: $350-1,000**

### Month 6 (5,000 users)
- Affiliate: $1,500-4,000
- AdSense: $250-1,000
- Premium (75 subscribers): $375
- **Total: $2,125-5,375**

### Year 1 (20,000 users)
- Affiliate: $6,000-16,000
- AdSense: $1,000-4,000
- Premium (400 subscribers): $2,000
- **Total: $9,000-22,000/month**

## 6. Analytics & Tracking

### Google Analytics 4
Add to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR_ID');
</script>
```

### Track Key Events
```javascript
// Track affiliate link clicks
gtag('event', 'click_affiliate', {
  'card_name': cardName,
  'platform': 'tcgplayer'
});

// Track premium upgrades
gtag('event', 'purchase', {
  'transaction_id': sessionId,
  'value': 4.99,
  'currency': 'USD',
  'items': [{ 'item_name': 'Premium Membership' }]
});
```

## 7. Legal Requirements

### Privacy Policy
Must disclose:
- Cookie usage (Google Analytics, AdSense)
- Affiliate relationships
- Data collection practices

### Terms of Service
Must include:
- User responsibilities
- Subscription terms
- Refund policy (for premium)

### Affiliate Disclosure
Add to footer:
> "As an Amazon Associate and TCGPlayer affiliate, we earn from qualifying purchases through links on this site."

## 8. Optimization Tips

### Increase Affiliate CTR
- A/B test button colors and copy
- Add "Best Price" badges
- Show price comparisons across platforms

### Increase Premium Conversions
- 7-day free trial
- Annual plan at discount ($49.99/year = 2 months free)
- Show "Premium Only" features prominently

### Increase AdSense Revenue
- Focus on high-value keywords (card investment, grading)
- Target collectors (higher CPMs than casual players)
- Optimize page load speed

---

**Ready to launch?** Start with affiliate links (easiest), then add AdSense once you have traffic, then premium subscriptions once you have engaged users.
