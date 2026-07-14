# 🚀 Quick Start - Email Alert System

## TL;DR - What You Need to Do

### 1. Install Dependency (5 min)
```bash
npm install resend
```

### 2. Sign Up for Resend (10 min)
1. Go to https://resend.com
2. Create account
3. Add your domain
4. Verify DNS records
5. Get API key

### 3. Configure Environment Variables (10 min)

**In Vercel Dashboard:**
```
RESEND_API_KEY=re_xxxxx
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
INTERNAL_API_KEY=<generate with crypto>
CRON_SECRET=<generate with crypto>
VITE_APP_URL=https://yourdomain.com
```

**Generate keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Update Email Address (2 min)
Edit `api/send-alert-email.js` line 299:
```javascript
from: 'PokéPrice Alerts <alerts@YOURDOMAIN.com>'
```

### 5. Deploy (5 min)
```bash
vercel --prod
```

### 6. Test (5 min)
1. Create alert in app with immediate trigger
2. Manually trigger cron:
```bash
curl -X POST https://yourdomain.com/api/monitor-alerts \
  -H "X-Cron-Secret: YOUR_SECRET"
```
3. Check your email!

**Total Time: ~45 minutes**

---

## Files You Got

### Core System
- ✅ `api/monitor-alerts.js` - Cron job (checks prices every 15 min)
- ✅ `api/send-alert-email.js` - Email sender
- ✅ `src/services/firestoreAlerts.js` - Database layer
- ✅ `src/templates/priceAlertEmail.js` - Email template

### Frontend
- ✅ `src/components/AlertsManager.jsx` - Alert dashboard (updated)
- ✅ `src/components/PriceAlertModal.jsx` - Create alert modal (updated)

### Config
- ✅ `vercel.json` - Cron configured
- ✅ `package.json` - Resend added
- ✅ `.env.template` - Setup guide

### Documentation
- ✅ `EMAIL_ALERTS_DOCUMENTATION.md` - Complete tech docs
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step guide
- ✅ `IMPLEMENTATION_SUMMARY.md` - What was built
- ✅ `QUICK_START.md` - This file

---

## How It Works (Simple Version)

```
1. User creates alert in your app
   └─> Saved to Firestore

2. Every 15 minutes, Vercel Cron runs
   └─> Checks all enabled alerts
   └─> Fetches current prices from TCG API
   └─> Compares to target prices

3. When condition is met
   └─> Generates beautiful HTML email
   └─> Sends via Resend
   └─> Logs to Firestore

4. User gets email notification
   └─> Clicks to view card or manage alerts
```

---

## Key Features

✅ **Unlimited alerts** for premium users
✅ **Real-time monitoring** every 15 minutes
✅ **Beautiful emails** matching your brand
✅ **3 conditions:** below, above, drops_to
✅ **Frequency control:** instant, daily, weekly
✅ **Real-time sync** across devices
✅ **Comprehensive logging** for debugging
✅ **Scalable** to thousands of users

---

## Costs (Estimated)

**100 users:** FREE (within all free tiers)
**500 users:** ~$30-50/month
**1000+ users:** ~$80-120/month

Scale as you grow!

---

## Need Help?

### Quick Links
- 📖 [Full Documentation](./EMAIL_ALERTS_DOCUMENTATION.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 📊 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- 🔧 [Environment Variables Guide](./.env.template)

### Troubleshooting

**No emails?**
- Check Resend API key is correct
- Verify domain is verified
- Check Vercel function logs

**Cron not running?**
- Verify CRON_SECRET matches
- Check Vercel dashboard → Cron Jobs

**Firestore errors?**
- Check FIREBASE_SERVICE_ACCOUNT is valid
- Verify Firestore is enabled

---

## What Users See

1. **Browse cards** → Find a card they like
2. **Click "Create Alert"** → Set target price
3. **Choose condition** → Below, above, or drops to
4. **Set frequency** → Instant, daily, or weekly
5. **Submit** → Alert is created
6. **Get email** → When price condition is met!

---

## Monitoring After Launch

**Daily (First Week):**
- Check Vercel logs for errors
- Monitor Resend delivery rate
- Look for user feedback

**Weekly:**
- Review alert trigger patterns
- Check Firebase usage/costs
- Analyze email open rates

**Monthly:**
- Optimize performance if needed
- Plan feature enhancements
- Review user satisfaction

---

## Future Ideas

- SMS notifications (Twilio)
- Push notifications
- Weekly digest emails
- Price predictions
- Alert templates
- Bulk management

---

## You're Ready! 🎉

Everything is built. Just need to:
1. Set up Resend
2. Configure environment variables
3. Deploy
4. Test

**Time to launch: ~45 minutes**

**Go make your users happy! 🚀**
