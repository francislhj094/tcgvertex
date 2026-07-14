# 🚀 Deployment Checklist

Use this checklist to launch your PokéPrice Tracker to production.

## Pre-Launch Checklist

### ✅ Content & Branding
- [ ] Update site name/logo if needed
- [ ] Write compelling meta descriptions for SEO
- [ ] Add favicon and social share images (Open Graph)
- [ ] Create 404 page
- [ ] Add privacy policy page
- [ ] Add terms of service page
- [ ] Add affiliate disclosure in footer

### ✅ Functionality Testing
- [ ] Test search on desktop and mobile
- [ ] Test card detail pages load correctly
- [ ] Test watchlist add/remove functionality
- [ ] Test all navigation links work
- [ ] Test responsive design on mobile/tablet
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify all images lazy-load correctly
- [ ] Test keyboard navigation and accessibility

### ✅ Performance Optimization
- [ ] Run Lighthouse audit (target 90+ performance score)
- [ ] Optimize images (use WebP format where possible)
- [ ] Enable production build minification
- [ ] Add loading states for all async operations
- [ ] Test with slow 3G network simulation

### ✅ SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Add robots.txt file
- [ ] Verify meta tags on all pages
- [ ] Add structured data (JSON-LD) for card pages
- [ ] Set up Google Analytics 4
- [ ] Create Google Search Console account

### ✅ Monetization Setup
- [ ] Apply for TCGPlayer affiliate program
- [ ] Apply for eBay Partner Network
- [ ] Apply for Google AdSense
- [ ] Integrate affiliate IDs into code
- [ ] Test affiliate links redirect correctly
- [ ] Add affiliate disclosure language
- [ ] Set up Stripe account for premium (optional for MVP)

### ✅ Legal & Compliance
- [ ] Add cookie consent banner (GDPR)
- [ ] Create privacy policy (use termly.io or similar)
- [ ] Create terms of service
- [ ] Add "unofficial fan site" disclaimer
- [ ] Verify copyright compliance

## Deployment Steps

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Build Project
```bash
npm run build
```

#### 3. Deploy
```bash
vercel
```

#### 4. Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_TCGPLAYER_AFFILIATE_ID=your_id
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 5. Configure Custom Domain
- Add your domain in Vercel dashboard
- Update DNS records as shown
- Enable automatic HTTPS

### Option 2: Netlify

#### 1. Build Project
```bash
npm run build
```

#### 2. Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or drag `dist/` folder into Netlify dashboard.

#### 3. Configure Build Settings
In Netlify Dashboard:
- Build command: `npm run build`
- Publish directory: `dist`

#### 4. Add Environment Variables
Settings → Build & Deploy → Environment:
```
VITE_TCGPLAYER_AFFILIATE_ID=your_id
```

### Option 3: GitHub Pages (Free Static Hosting)

#### 1. Update vite.config.js
```javascript
export default {
  base: '/your-repo-name/',
  // ... rest of config
}
```

#### 2. Install gh-pages
```bash
npm install -D gh-pages
```

#### 3. Add Deploy Script to package.json
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

#### 4. Deploy
```bash
npm run deploy
```

## Post-Launch Checklist

### ✅ Immediate (Day 1)
- [ ] Test site on production URL
- [ ] Verify affiliate links work in production
- [ ] Submit to Google Search Console
- [ ] Share on social media (Twitter, Reddit r/pkmntcg)
- [ ] Post on Product Hunt (optional)
- [ ] Monitor error logs

### ✅ Week 1
- [ ] Check Google Analytics for traffic
- [ ] Monitor affiliate dashboard for clicks
- [ ] Check for broken links or console errors
- [ ] Gather initial user feedback
- [ ] Fix any critical bugs

### ✅ Month 1
- [ ] Analyze top-performing cards (most viewed)
- [ ] Check affiliate conversion rate (target 8-12%)
- [ ] Review Google Search Console for indexed pages
- [ ] Plan content updates (blog posts about trending cards)
- [ ] A/B test CTA buttons

## Marketing Launch Plan

### Content Marketing
- [ ] Write blog post: "Top 10 Most Valuable Pokémon Cards in 2026"
- [ ] Create price tracking guide for beginners
- [ ] Share on Reddit: r/pkmntcg, r/PokemonTCG
- [ ] Post on Twitter with #PokemonTCG hashtag

### SEO Strategy
Target these long-tail keywords:
- "[card name] price" (e.g., "Charizard VMAX price")
- "[card name] price history"
- "[card name] worth"
- "pokemon card price tracker"
- "tcg price alerts"

### Social Media
- [ ] Create Twitter account (@PokePrice or similar)
- [ ] Create Instagram for visual card content
- [ ] Join Pokémon TCG Discord servers
- [ ] Engage in r/pkmntcg discussions

### Partnerships
- [ ] Reach out to Pokémon TCG YouTubers for reviews
- [ ] Contact TCG blogs for backlinks
- [ ] Partner with local card shops (affiliate deals)

## Monitoring & Analytics

### Tools to Set Up
1. **Google Analytics 4** - Track user behavior
2. **Google Search Console** - Monitor SEO performance
3. **Sentry** (optional) - Track JavaScript errors
4. **Hotjar** (optional) - User session recordings

### Key Metrics to Track
- **Traffic**: Daily active users, page views
- **Engagement**: Average session duration, watchlist adds
- **Revenue**: Affiliate CTR, premium conversions
- **SEO**: Organic search traffic, keyword rankings
- **Performance**: Page load speed, Core Web Vitals

### Weekly Review
Review these metrics every Monday:
- Total users (week over week growth)
- Top 10 most-viewed cards
- Affiliate click-through rate
- Premium sign-ups
- Top traffic sources

## Scaling Plan

### 10,000 Monthly Users
- Optimize database queries (if using backend)
- Enable CDN for images (Cloudflare)
- Add server-side caching (Redis)

### 50,000 Monthly Users
- Migrate to paid Pokémon TCG API plan (if needed)
- Implement rate limiting
- Consider dedicated server vs serverless
- Hire content writer for blog

### 100,000+ Monthly Users
- Build mobile app (React Native)
- Add more TCG games (Magic, Yu-Gi-Oh)
- Hire developer for maintenance
- Consider venture funding

## Troubleshooting

### Site Won't Load
- Check build logs for errors
- Verify all environment variables are set
- Check browser console for JavaScript errors

### Affiliate Links Not Working
- Verify affiliate IDs are correct
- Check affiliate program status (approved?)
- Test links in incognito mode

### Slow Performance
- Enable Vite production mode minification
- Optimize images with ImageOptim or Squoosh
- Enable Brotli compression on hosting platform
- Lazy-load card images

### SEO Not Working
- Wait 2-4 weeks for Google to index
- Submit sitemap manually in Search Console
- Check robots.txt isn't blocking crawlers
- Add more unique content (blog posts)

## Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **TCGPlayer Affiliate Support**: partners@tcgplayer.com
- **Google AdSense Support**: https://support.google.com/adsense/

---

**Ready to launch?** Go through this checklist step-by-step. Don't skip the legal/privacy policy pages—they're required for AdSense approval.

Good luck! 🎉
