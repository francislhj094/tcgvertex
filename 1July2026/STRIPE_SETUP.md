# Stripe Integration Setup - FINAL STEPS

## ✅ What's Done:
1. ✅ Stripe.js library installed
2. ✅ Serverless functions created (create-checkout, webhook)
3. ✅ Payment flow integrated
4. ✅ Success/cancel handling implemented
5. ✅ Deployed to production

---

## 🔧 IMPORTANT: Set Up Stripe Webhook

You need to configure Stripe to send payment notifications to your site.

### Step 1: Go to Stripe Webhooks
1. Go to: https://dashboard.stripe.com/webhooks
2. Make sure you're in **LIVE MODE** (toggle top-right)

### Step 2: Add Endpoint
1. Click **"Add endpoint"** button
2. Enter this URL: `https://tcgvertex.com/api/webhook`
3. Click **"Select events"**
4. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**

### Step 3: Get Webhook Secret
1. After creating the endpoint, click on it
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 4: Add to Vercel Environment Variables
1. Go to: https://vercel.com/lee-han-jies-projects/tcg-vault/settings/environment-variables
2. Click **"Add New"**
3. Name: `STRIPE_WEBHOOK_SECRET`
4. Value: (paste the whsec_... secret)
5. Environment: **Production**
6. Click **"Save"**

### Step 5: Redeploy (After Adding Secret)
Run this command:
```bash
npx vercel --prod
```

---

## 🧪 Test Real Payment

### How to Test:
1. Go to: https://tcgvertex.com/premium
2. Click **"Upgrade Now - $9.99"**
3. You'll be redirected to Stripe Checkout
4. Use a real credit card (this is LIVE MODE - real charges!)
5. Complete payment
6. You'll be redirected back with success message
7. Premium features should unlock automatically

### Test Credit Card (Stripe Test Mode Only):
If you want to test first in test mode:
- Card: `4242 4242 4242 4242`
- Date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 🎉 What Happens When Someone Pays:

1. **User clicks "Upgrade Now"**
2. **Serverless function creates Stripe checkout session**
3. **User redirects to Stripe payment page**
4. **User enters card details and pays**
5. **Stripe processes payment ($9.99)**
6. **Webhook notifies your site (payment succeeded)**
7. **User redirects back to your site**
8. **Premium activates automatically**
9. **User gets success toast notification**

---

## 💰 Revenue Setup:

Your Stripe account will now:
- ✅ Accept real credit card payments
- ✅ Process $9.99 charges
- ✅ Deposit money to your bank account (after payout schedule)
- ✅ Handle refunds if needed
- ✅ Provide sales analytics

### Stripe Fees:
- 2.9% + $0.30 per transaction
- $9.99 charge = You keep **$9.40** per sale
- Stripe takes $0.59

---

## 📊 Monitor Payments:

Check your Stripe Dashboard:
- **Payments:** https://dashboard.stripe.com/payments
- **Customers:** https://dashboard.stripe.com/customers
- **Products:** https://dashboard.stripe.com/products
- **Analytics:** https://dashboard.stripe.com/analytics

---

## ⚠️ Important Security Notes:

1. **Never commit API keys** to git
2. **Webhook secret is required** for production
3. **Keys are already in your code** (in api/ folder)
4. **Environment variables** keep them secure on Vercel
5. **Rotate keys periodically** for security

---

## 🚀 YOU'RE LIVE!

Your site can now accept real payments. Every $9.99 sale:
- ✅ Automatically processed by Stripe
- ✅ Money deposited to your bank
- ✅ User gets instant premium access
- ✅ All features unlock

**NEXT STEP:** Set up the webhook (instructions above) and test a payment!
