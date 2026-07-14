# 🚀 Email Alert System - Deployment Checklist

## Pre-Deployment

### ✅ 1. Install Dependencies
- [x] Added `resend` to package.json
- [ ] Run `npm install` to install Resend package

### ✅ 2. Code Files Created/Updated

**New Files:**
- [x] `api/monitor-alerts.js` - Main price monitoring cron job
- [x] `api/send-alert-email.js` - Email sending endpoint
- [x] `src/services/firestoreAlerts.js` - Firestore alert management
- [x] `src/templates/priceAlertEmail.js` - Email HTML templates
- [x] `.env.template` - Environment variables guide
- [x] `EMAIL_ALERTS_DOCUMENTATION.md` - Complete documentation

**Updated Files:**
- [x] `package.json` - Added Resend dependency
- [x] `vercel.json` - Added cron job configuration
- [x] `src/components/AlertsManager.jsx` - Updated to use Firestore
- [x] `src/components/PriceAlertModal.jsx` - Updated to use Firestore
- [x] `src/services/priceAlerts.js` - Added migration helper

### ✅ 3. Configuration Files
- [x] Cron job configured in `vercel.json` (every 15 minutes)
- [x] Function timeout set to 60s for monitor-alerts
- [x] Environment variable template created

## Deployment Steps

### 📧 1. Set Up Resend (Email Service)

**Action Items:**
- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Add and verify your domain (e.g., yourdomain.com)
- [ ] Create API key in Resend dashboard
- [ ] Copy API key for environment variables
- [ ] Update email "from" address in `api/send-alert-email.js`:
  ```javascript
  from: 'PokéPrice Alerts <alerts@yourdomain.com>'
  ```

**Verification:**
- [ ] Domain shows "Verified" in Resend dashboard
- [ ] DNS records are properly configured
- [ ] Test email can be sent from Resend dashboard

### 🔥 2. Set Up Firebase Firestore

**Action Items:**
- [ ] Go to Firebase Console > Firestore Database
- [ ] Click "Create Database" (if not already created)
- [ ] Choose "Production mode"
- [ ] Select your preferred region
- [ ] Go to Project Settings > Service Accounts
- [ ] Click "Generate New Private Key"
- [ ] Download the JSON file
- [ ] Keep this file secure (DO NOT commit to git)

**Verification:**
- [ ] Firestore database is active
- [ ] Collections can be created manually
- [ ] Service account JSON downloaded

### 🔐 3. Generate Security Keys

**Action Items:**
Run these commands to generate secure random keys:

```bash
# Generate INTERNAL_API_KEY
node -e "console.log('INTERNAL_API_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET
node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] Copy both generated keys
- [ ] Store securely for next step

### 🎯 4. Configure Environment Variables

**For Local Development:**
Create `.env.local` file:

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx

# Firebase (minify the JSON to one line)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"..."}'

# Pokémon TCG API (optional)
POKEMON_TCG_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Security
INTERNAL_API_KEY=your_generated_key_here
CRON_SECRET=your_generated_cron_secret_here

# App URL
VITE_APP_URL=http://localhost:5173
```

**For Vercel Production:**
- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Go to Settings > Environment Variables
- [ ] Add each variable above with production values
- [ ] Set `VITE_APP_URL` to your production domain
- [ ] Make sure to add variables for all environments (Production, Preview, Development)

**Verification:**
- [ ] All environment variables are set in Vercel
- [ ] No placeholder values remain
- [ ] FIREBASE_SERVICE_ACCOUNT is properly formatted (minified JSON)

### 🚀 5. Deploy to Vercel

**Action Items:**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Or push to Git if connected:
```bash
git add .
git commit -m "Add email alert system"
git push origin main
```

**Verification:**
- [ ] Deployment succeeds without errors
- [ ] All environment variables are loaded
- [ ] Functions are deployed successfully

### ⏰ 6. Verify Cron Job

**Action Items:**
- [ ] Go to Vercel Dashboard > Your Project
- [ ] Navigate to "Cron Jobs" tab
- [ ] Verify `monitor-alerts` appears in the list
- [ ] Check schedule shows `*/15 * * * *` (every 15 minutes)
- [ ] Wait 15 minutes and check first run

**Verification:**
- [ ] Cron job is listed in Vercel dashboard
- [ ] First execution completes successfully
- [ ] Check logs show proper execution

### 🔍 7. Create Firestore Indexes

**Action Items:**
When you first run the app, Firestore may prompt you to create indexes. Click the links or create manually:

1. **Index for getUserAlerts:**
   - Collection: `priceAlerts`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

2. **Index for monitoring:**
   - Collection: `priceAlerts`
   - Fields: `enabled` (Ascending), `lastChecked` (Ascending)

**Verification:**
- [ ] All required indexes are created
- [ ] No index warnings in console
- [ ] Queries execute without errors

### 🧪 8. Test the System

**Create Test Alert:**
- [ ] Log in to your app as a premium user
- [ ] Navigate to a card detail page
- [ ] Click "Create Price Alert"
- [ ] Set a target price that should trigger immediately
- [ ] Submit the alert

**Verify Alert Created:**
- [ ] Check Firebase Console > Firestore > priceAlerts collection
- [ ] Alert document should appear with correct data
- [ ] `enabled` should be `true`

**Trigger Cron Manually:**
```bash
curl -X POST https://yourdomain.com/api/monitor-alerts \
  -H "X-Cron-Secret: YOUR_CRON_SECRET"
```

**Expected Results:**
- [ ] API returns success response
- [ ] Check Resend dashboard - email should appear
- [ ] Check your email inbox - alert email received
- [ ] Check Firestore > alertLogs - log entry created
- [ ] Check Firestore > priceAlerts - `lastTriggered` updated

### 📊 9. Monitor Performance

**Initial Monitoring (First 24 Hours):**
- [ ] Check Vercel function logs every few hours
- [ ] Monitor Resend email delivery rate
- [ ] Check Firebase Firestore usage
- [ ] Verify no errors in logs

**Locations to Monitor:**
1. **Vercel Dashboard** > Deployments > Functions > monitor-alerts
2. **Resend Dashboard** > Emails (check delivery status)
3. **Firebase Console** > Firestore > Usage tab
4. **Firestore** > monitoringLogs collection (automatic logs)

### 🎨 10. Customize Email Template (Optional)

**Action Items:**
- [ ] Update logo in email template
- [ ] Customize colors to match brand
- [ ] Update footer links
- [ ] Test email rendering in different clients

**Files to Edit:**
- `api/send-alert-email.js` - Main email generation
- `src/templates/priceAlertEmail.js` - Template helpers

## Post-Deployment

### 📝 Documentation for Users

**Create Help Articles:**
- [ ] How to create price alerts
- [ ] Understanding alert conditions (below, above, drops_to)
- [ ] Managing alert frequency
- [ ] Troubleshooting email delivery

**Update Website:**
- [ ] Add "Email Alerts" to premium features list
- [ ] Update pricing page with alert details
- [ ] Add FAQ about alerts

### 🔔 Announce to Users

**Announcement Channels:**
- [ ] In-app notification banner
- [ ] Email to existing premium users
- [ ] Social media announcement
- [ ] Blog post about the feature

### 📈 Analytics & Tracking

**Set Up Tracking:**
- [ ] Track alert creation rate
- [ ] Monitor email open rates in Resend
- [ ] Track alert trigger frequency
- [ ] Monitor premium conversion from alert feature

### 🛡️ Security Review

**Security Checklist:**
- [ ] All secrets stored in environment variables (not in code)
- [ ] API endpoints protected with authentication
- [ ] Rate limiting considered (if needed)
- [ ] User data properly secured in Firestore
- [ ] Email content sanitized (no XSS vulnerabilities)

### 🔄 Maintenance Plan

**Weekly:**
- [ ] Check Vercel function logs for errors
- [ ] Review Resend email bounce rate
- [ ] Monitor Firebase usage and costs

**Monthly:**
- [ ] Review alert trigger patterns
- [ ] Optimize slow queries if needed
- [ ] Check for stale/disabled alerts to clean up
- [ ] Review and update email templates

**Quarterly:**
- [ ] Rotate API keys and secrets
- [ ] Review and optimize function performance
- [ ] Analyze user feedback on alerts
- [ ] Plan feature enhancements

## Troubleshooting

### Common Issues & Solutions

**Issue: Emails not sending**
- [ ] Verify RESEND_API_KEY is correct
- [ ] Check domain is verified in Resend
- [ ] Verify user has isPremium: true
- [ ] Check spam folder

**Issue: Cron not running**
- [ ] Verify CRON_SECRET matches
- [ ] Check function timeout (should be 60s)
- [ ] Look for errors in Vercel logs

**Issue: Prices not updating**
- [ ] Verify POKEMON_TCG_API_KEY is valid
- [ ] Check API rate limits
- [ ] Verify cardId format is correct

**Issue: Firestore permission denied**
- [ ] Check FIREBASE_SERVICE_ACCOUNT is valid
- [ ] Verify service account has Firestore permissions
- [ ] Check Firestore security rules

## Success Metrics

**Track These KPIs:**
- [ ] Number of active alerts created
- [ ] Email delivery success rate (>98%)
- [ ] Alert trigger accuracy
- [ ] Average email open rate (>25%)
- [ ] Premium conversion from alert users
- [ ] User satisfaction with alerts

## Next Steps (Future Enhancements)

**Phase 2 (1-2 months):**
- [ ] SMS notifications via Twilio
- [ ] Push notifications
- [ ] Weekly digest emails
- [ ] Alert analytics dashboard

**Phase 3 (3-6 months):**
- [ ] Price prediction ML model
- [ ] Alert templates
- [ ] Bulk alert management
- [ ] Alert sharing between users

---

## 🎉 Deployment Complete!

Once all checkboxes are complete, your email alert system is live and ready to delight your premium users!

**Questions or Issues?**
- Review `EMAIL_ALERTS_DOCUMENTATION.md` for detailed information
- Check Vercel function logs for errors
- Contact support if needed

**Congratulations on building a premium email alert system! 🚀**
