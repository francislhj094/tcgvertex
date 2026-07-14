# PokéPrice Tracker

A professional Pokémon TCG card price tracker built with React and Vite. Track real-time card prices, monitor trends, and get alerts when your favorite cards drop in price.

![PokéPrice Tracker](https://img.shields.io/badge/Status-MVP-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 MVP Features

### Core Functionality
- **Real-time Price Tracking** - Live market data from TCGPlayer API via Pokémon TCG API
- **Smart Search** - Instant search by card name, set, or number
- **Price History** - View 30-day price trends and market movement
- **Watchlist** - Track up to 10 cards for free (unlimited with Premium)
- **Trending Cards** - See biggest movers in the last 24 hours
- **Price Alerts** - Get notified when prices drop (Premium feature)

### Design
- **Warm, Professional Aesthetic** - Cream background (#F7F4EF), terracotta accents (#C4612F)
- **Editorial Typography** - Fraunces serif headings with italicized keywords, Inter body text
- **Mobile-first Responsive** - Works beautifully on all devices
- **Fast & Accessible** - Lazy-loaded images, semantic HTML, keyboard navigation

### Monetization (Day 1)
- **Affiliate Links** - TCGPlayer, eBay, and Card Market affiliate links on every card
- **Google AdSense** - Display ads in sidebar and between results (for free users)
- **Premium Tier** - $4.99/month for unlimited watchlist, instant alerts, and ad-free experience

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── CardDisplay.jsx      # Individual card component with price/trend
│   ├── CardSkeleton.jsx     # Loading skeleton for cards
│   ├── Footer.jsx           # Site footer with links
│   ├── Navbar.jsx           # Navigation bar
│   └── PriceTable.jsx       # Price breakdown table
├── pages/
│   ├── LandingPage.jsx      # Homepage with hero and pricing
│   ├── MarketDashboard.jsx  # Main card browsing interface
│   ├── CardDetailPage.jsx   # Individual card details
│   ├── PortfolioPage.jsx    # User watchlist
│   ├── SetsPage.jsx         # Browse by card sets
│   └── SetDetailPage.jsx    # Cards within a set
├── services/
│   ├── api.js               # Pokémon TCG API integration
│   └── vault.js             # Local storage for watchlist
├── context/
│   └── ToastContext.jsx     # Toast notifications
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles

```

## 🎨 Design System

### Colors
```css
--bg-primary: #F7F4EF          /* Warm cream background */
--bg-secondary: #FBF9F5        /* Lighter cream for cards */
--bg-white: #FFFFFF            /* Pure white surfaces */
--bg-dark: #1F2421             /* Warm charcoal for dark sections */
--border-warm: #E7E1D7         /* Warm hairline borders */

--accent-terracotta: #C4612F   /* Primary accent color */
--accent-terracotta-hover: #A94E22
--accent-terracotta-tint: #F2E3D6  /* Soft tint for pills */
--accent-green: #10b981        /* Price increase indicator */
--accent-red: #ef4444          /* Price decrease indicator */

--text-primary: #1F2421        /* Main text color */
--text-secondary: #5C635D      /* Muted text */
--text-muted: #8A8F8B          /* Subtle text */
```

### Typography
- **Headings**: Fraunces (serif) at 400 weight with -0.02em tracking
- **Body**: Inter at 300-500 weight
- **Buttons**: Inter at 500 weight

### Components
- **Buttons**: Fully rounded (999px) pill buttons with subtle hover lift
- **Cards**: White surfaces with warm borders, 2px lift on hover
- **Pills**: Terracotta tint background for labels and chips

## 🔌 API Integration

Uses the [Pokémon TCG API](https://pokemontcg.io/) for card data:
- Card search and filtering
- Real-time pricing from TCGPlayer
- Card images and metadata
- Set information

**No API key required** for the free tier (100 requests/hour).

## 💰 Monetization Setup

### 1. Affiliate Links
Update `src/services/api.js` with your affiliate IDs:

```javascript
export const buildAffiliateLink = (rawUrl) => {
  if (!rawUrl) return '#';
  
  const TCGPLAYER_AFFILIATE_ID = 'your_id_here';
  const url = new URL(rawUrl);
  url.searchParams.set('partner', TCGPLAYER_AFFILIATE_ID);
  url.searchParams.set('utm_campaign', 'affiliate');
  
  return url.toString();
};
```

### 2. Google AdSense
Add AdSense code to `index.html` and place ad units in:
- Market dashboard sidebar
- Between card rows (every 8 cards)
- Footer section

### 3. Premium Payments
Integrate Stripe for premium subscriptions:
- Use Stripe Checkout for one-click upgrades
- Store subscription status in Firebase/Supabase
- Gate premium features (unlimited watchlist, alerts)

## 📊 Success Metrics

Track these KPIs:
- **Affiliate CTR**: Target 8-12% click-through rate on "Buy Now" buttons
- **Premium Conversion**: Target 2-3% of active users upgrading within 60 days
- **SEO Traffic**: Rank for "[card name] price" searches
- **User Engagement**: Average 3-5 cards in watchlist per user

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables
Set these in your deployment platform:
- `VITE_TCGPLAYER_AFFILIATE_ID` - Your TCGPlayer affiliate ID
- `VITE_EBAY_AFFILIATE_ID` - Your eBay Partner Network ID
- `VITE_GOOGLE_ADSENSE_ID` - Your AdSense publisher ID

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ Card search and browsing
- ✅ Real-time pricing
- ✅ Watchlist (local storage)
- ✅ Affiliate links
- ✅ Responsive design

### Phase 2: User Accounts (Next)
- [ ] Firebase/Supabase authentication
- [ ] Cloud-synced watchlist
- [ ] Email price alerts
- [ ] Premium subscription via Stripe

### Phase 3: Advanced Features
- [ ] Price prediction ML model
- [ ] Portfolio value tracking
- [ ] Deck builder with legality checker
- [ ] Set completion tracker

### Phase 4: Expansion
- [ ] Magic: The Gathering support
- [ ] Yu-Gi-Oh! support
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this project for your own price tracker.

## ⚖️ Legal

- This is an unofficial fan site. Pokémon and all related properties are © Nintendo/Creatures Inc./GAME FREAK inc.
- Pricing data is provided by TCGPlayer and Pokémon TCG API
- Affiliate disclosure: This site contains affiliate links and earns commission on qualifying purchases

---

Built with ❤️ for Pokémon TCG collectors
