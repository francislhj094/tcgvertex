# 🔔 Email Alert System - Complete Documentation

## Overview

This premium email alert system monitors Pokémon TCG card prices in real-time and sends beautiful, professional email notifications when price conditions are met. Built with Vercel serverless functions, Firebase Firestore, and Resend email service.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React + UI)   │
└────────┬────────┘
         │
         ├─── Creates/Manages Alerts
         │
┌────────▼────────────────────┐
│   Firestore Database        │
│  - priceAlerts collection   │
│  - alertLogs collection     │
│  - monitoringLogs           │
└────────┬────────────────────┘
         │
         │ Reads alerts every 15 min
         │
┌────────▼────────────────────┐
│  Vercel Cron Job            │
│  /api/monitor-alerts        │
│  - Fetches enabled alerts   │
│  - Checks TCG API prices    │
│  - Evaluates conditions     │
└────────┬────────────────────┘
         │
         ├─── Condition Met?
         │
┌────────▼────────────────────┐
│  Email Service              │
│  /api/send-alert-email      │
│  - Generates HTML email     │
│  - Sends via Resend         │
│  - Logs notification        │
└─────────────────────────────┘
```

## Features

### ✅ Implemented

1. **Premium Email Templates**
   - Beautiful, responsive HTML emails
   - Card images and pricing details
   - Branded design matching app aesthetic
   - Mobile-optimized layout

2. **Firestore Integration**
   - Real-time alert syncing across devices
   - Server-side alert management
   - Comprehensive logging system
   - Migration from localStorage

3. **Intelligent Monitoring**
   - Checks prices every 15 minutes
   - Three alert conditions: below, above, drops_to
   - Frequency controls: instant, daily, weekly
   - Automatic price updates

4. **Security**
   - API key authentication
   - Cron secret verification
   - Premium status validation
   - Rate limiting ready

5. **Observability**
   - Detailed monitoring logs
   - Email delivery tracking
   - Alert trigger history
   - Performance metrics

## File Structure

```
d:/TCG/
├── api/
│   ├── monitor-alerts.js         # Main cron job - checks all alerts
│   ├── send-alert-email.js       # Email sending endpoint
│   ├── webhook.js                # Stripe webhook (existing)
│   └── create-checkout.js        # Stripe checkout (existing)
│
├── src/
│   ├── components/
│   │   ├── AlertsManager.jsx     # Alert dashboard (updated for Firestore)
│   │   └── PriceAlertModal.jsx   # Create alert modal (updated)
│   │
│   ├── services/
│   │   ├── firestoreAlerts.js    # New Firestore alert service
│   │   ├── priceAlerts.js        # Legacy localStorage service
│   │   └── firebase.js           # Firebase config (existing)
│   │
│   └── templates/
│       └── priceAlertEmail.js    # Email template generator
│
├── .env.template                  # Environment variables guide
├── vercel.json                    # Vercel config with cron
└── package.json                   # Updated with Resend
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install resend
```

### 2. Configure Environment Variables

Create `.env.local` or set in Vercel Dashboard:

```bash
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxx

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# Pokémon TCG API (optional, higher rate limits)
POKEMON_TCG_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Security
INTERNAL_API_KEY=your_secure_random_key_here
CRON_SECRET=your_cron_secret_here

# App URL
VITE_APP_URL=https://yourdomain.com
```

**Generate secure keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key from dashboard
4. Update email "from" address in `api/send-alert-email.js`:
   ```javascript
   from: 'PokéPrice Alerts <alerts@yourdomain.com>'
   ```

### 4. Configure Firebase

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Minify it (remove whitespace) and paste into `FIREBASE_SERVICE_ACCOUNT`

**Enable Firestore:**
1. Firebase Console > Firestore Database
2. Click "Create Database"
3. Choose production mode
4. Select region closest to your users

### 5. Deploy to Vercel

```bash
vercel --prod
```

After deployment:
1. Go to Vercel Dashboard > Project Settings > Environment Variables
2. Add all environment variables
3. Redeploy to apply changes

### 6. Verify Cron Job

1. Vercel Dashboard > Deployments > Your Project
2. Navigate to "Cron Jobs" tab
3. Verify `monitor-alerts` is scheduled for `*/15 * * * *` (every 15 minutes)
4. Check recent runs for errors

## API Endpoints

### POST /api/monitor-alerts

**Purpose:** Main cron job that checks all enabled alerts and triggers emails

**Authentication:** Requires `X-Cron-Secret` header

**Called by:** Vercel Cron (every 15 minutes)

**Request:**
```bash
curl -X POST https://yourdomain.com/api/monitor-alerts \
  -H "X-Cron-Secret: your_cron_secret"
```

**Response:**
```json
{
  "success": true,
  "total": 45,
  "processed": 43,
  "triggered": 7,
  "failed": 0,
  "skipped": 2,
  "duration": 8423,
  "details": [
    {
      "cardName": "Charizard VMAX",
      "userEmail": "user@example.com",
      "oldPrice": 89.99,
      "newPrice": 79.99
    }
  ]
}
```

### POST /api/send-alert-email

**Purpose:** Sends a single price alert email

**Authentication:** Requires `X-Api-Key` header

**Called by:** `monitor-alerts.js` internally

**Request:**
```json
{
  "alertId": "alert_123abc",
  "userId": "user_456def",
  "userEmail": "user@example.com",
  "alertData": {
    "cardId": "sv3pt5-208",
    "cardName": "Charizard ex",
    "cardImage": "https://...",
    "setName": "151",
    "rarity": "Ultra Rare",
    "oldPrice": 89.99,
    "newPrice": 79.99,
    "targetPrice": 80.00,
    "condition": "below",
    "priceChange": -10.00,
    "percentChange": -11.1,
    "alertFrequency": "instant"
  }
}
```

**Response:**
```json
{
  "success": true,
  "emailId": "re_abc123xyz",
  "message": "Alert email sent successfully"
}
```

## Firestore Collections

### priceAlerts

Stores all user price alerts.

```javascript
{
  userId: "string",
  cardId: "string",
  cardName: "string",
  cardImage: "string",
  setName: "string",
  rarity: "string",
  currentPrice: number,
  targetPrice: number,
  condition: "below" | "above" | "drops_to",
  alertType: "email" | "push" | "both",
  frequency: "instant" | "daily" | "weekly",
  enabled: boolean,
  createdAt: timestamp,
  lastChecked: timestamp,
  lastTriggered: timestamp | null,
  triggeredCount: number,
  notificationsSent: number
}
```

**Indexes needed:**
- `userId` (ascending)
- `enabled` (ascending)
- `cardId` (ascending)

### alertLogs

Logs every time an alert is triggered.

```javascript
{
  alertId: "string",
  userId: "string",
  cardId: "string",
  cardName: "string",
  oldPrice: number,
  newPrice: number,
  targetPrice: number,
  condition: "string",
  priceChange: number,
  percentChange: number,
  emailSent: boolean,
  emailId: "string",
  triggeredAt: timestamp
}
```

### monitoringLogs

Tracks each cron job run.

```javascript
{
  timestamp: timestamp,
  alertsChecked: number,
  alertsTriggered: number,
  alertsFailed: number,
  alertsSkipped: number,
  duration: number,
  details: array
}
```

## Frontend Usage

### Create Alert

```javascript
import { createAlert } from '../services/firestoreAlerts';

const alertData = {
  cardId: card.id,
  cardName: card.name,
  cardImage: card.images.small,
  setName: card.set.name,
  rarity: card.rarity,
  currentPrice: 89.99,
  targetPrice: 80.00,
  condition: 'below',
  alertType: 'email',
  frequency: 'instant'
};

await createAlert(alertData, user.uid);
```

### Subscribe to Real-time Updates

```javascript
import { subscribeToUserAlerts } from '../services/firestoreAlerts';

useEffect(() => {
  const unsubscribe = subscribeToUserAlerts(user.uid, (alerts) => {
    setAlerts(alerts);
  });
  
  return () => unsubscribe();
}, [user.uid]);
```

### Migrate from localStorage

```javascript
import { getAlerts } from '../services/priceAlerts';
import { migrateLocalAlertsToFirestore } from '../services/firestoreAlerts';

const localAlerts = getAlerts(user.uid);
const results = await migrateLocalAlertsToFirestore(user.uid, localAlerts);

console.log(`Migrated ${results.success} alerts`);
```

## Email Template Customization

The email template is in `src/templates/priceAlertEmail.js`. Customize:

1. **Colors** - Match your brand
2. **Logo** - Add your logo image
3. **Footer** - Update links and social media
4. **Copy** - Adjust tone and messaging

Example customization:

```javascript
const emailHtml = `
  <div class="header">
    <img src="https://yourdomain.com/logo.png" alt="Logo" style="height: 40px;" />
    <h1>🔔 Price Alert Triggered!</h1>
  </div>
`;
```

## Monitoring & Debugging

### Check Cron Job Runs

1. Vercel Dashboard > Project > Deployments
2. Click on latest deployment
3. Navigate to "Functions" tab
4. Filter by `monitor-alerts`
5. View logs for each execution

### Check Email Delivery

1. Resend Dashboard > Emails
2. Filter by date/recipient
3. View delivery status, opens, clicks
4. Check for bounces or spam reports

### Check Firestore Data

1. Firebase Console > Firestore Database
2. View collections: `priceAlerts`, `alertLogs`, `monitoringLogs`
3. Check indexes are created
4. Monitor read/write usage

### Common Issues

**No emails sending:**
- Check `RESEND_API_KEY` is set correctly
- Verify domain is verified in Resend
- Check Vercel function logs for errors
- Verify user has `isPremium: true` in Firestore

**Cron not running:**
- Check `CRON_SECRET` matches in code and Vercel
- Verify cron job is visible in Vercel dashboard
- Check function timeout (should be 60s for monitor-alerts)

**Price not updating:**
- Verify `POKEMON_TCG_API_KEY` is valid
- Check API rate limits
- Verify `cardId` format is correct

## Performance Optimization

### Current Performance

- **Cron frequency:** Every 15 minutes
- **Batch size:** 10 alerts per batch
- **Function timeout:** 60 seconds
- **Expected duration:** ~8-12 seconds for 50 alerts

### Scaling Considerations

**For 100-500 alerts:**
- Current setup handles well
- Monitor function duration

**For 500-2000 alerts:**
- Increase batch size to 20
- Consider parallel processing
- Monitor API rate limits

**For 2000+ alerts:**
- Split into multiple cron jobs by region/category
- Implement queue system (Bull/BullMQ)
- Consider dedicated monitoring service

## Cost Analysis

### Monthly Costs (estimated)

**Resend:**
- Free tier: 3,000 emails/month
- Pro: $20/month for 50,000 emails
- Example: 100 users × 10 alerts/month = 1,000 emails

**Vercel:**
- Hobby: Free (100GB-hours/month)
- Pro: $20/month (unlimited)
- Cron executions are free

**Firebase:**
- Free tier: 50k reads + 20k writes/day
- Pay-as-you-go after
- Example: 100 alerts × 96 checks/day = 9,600 reads/day

**Total for 100 premium users:** ~$0-20/month (within free tiers)

## Testing

### Manual Testing

1. **Create test alert:**
```bash
# In your app, create an alert with a condition that's immediately true
```

2. **Trigger cron manually:**
```bash
curl -X POST https://yourdomain.com/api/monitor-alerts \
  -H "X-Cron-Secret: your_cron_secret"
```

3. **Check email delivery** in Resend dashboard

### Automated Testing

Create a test script:

```javascript
// test-alerts.js
import admin from 'firebase-admin';

// Initialize Firebase
admin.initializeApp({...});

// Create test alert
const testAlert = {
  userId: 'test_user',
  cardId: 'sv3pt5-208',
  cardName: 'Test Card',
  currentPrice: 100,
  targetPrice: 50,
  condition: 'below',
  enabled: true
};

// Run test
await admin.firestore().collection('priceAlerts').add(testAlert);
console.log('Test alert created');
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate keys regularly** - Update every 90 days
3. **Monitor logs** - Check for suspicious activity
4. **Rate limit** - Implement on endpoints if needed
5. **Validate input** - Always validate alert data
6. **Premium checks** - Verify user status before sending emails

## Support & Troubleshooting

### User-facing Issues

**"Alert not sending emails"**
1. Verify email address is correct in user profile
2. Check spam folder
3. Verify premium status is active
4. Check alert is enabled

**"Wrong price in email"**
1. Price updates every 15 minutes
2. TCG API may have delays
3. Check `lastChecked` timestamp in Firestore

### Developer Issues

See logs:
```bash
vercel logs --follow
```

Check specific function:
```bash
vercel logs monitor-alerts
```

## Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Push notifications via Firebase Cloud Messaging
- [ ] Weekly digest emails
- [ ] Price prediction based on historical data
- [ ] Multiple cards in one alert
- [ ] Alert templates (e.g., "10% drop from current")
- [ ] Alert sharing between users
- [ ] Export alert history as CSV

## Support

For issues or questions:
- GitHub Issues: [your-repo]
- Email: support@yourdomain.com
- Documentation: [your-docs]

---

**Built with ❤️ for Pokémon TCG collectors**
