// Vercel Serverless Function - Send Price Alert Email
// Handles individual email sending via Resend

import { Resend } from 'resend';
import admin from 'firebase-admin';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Firebase Admin SDK (if not already initialized)
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

/**
 * Generate email HTML for price alert
 */
const generateAlertEmail = (alertData) => {
  const {
    cardName,
    cardImage,
    oldPrice,
    newPrice,
    targetPrice,
    condition,
    priceChange,
    percentChange,
    cardId,
    setName,
    rarity,
    alertFrequency
  } = alertData;

  const isPriceDrop = parseFloat(priceChange) < 0;
  const priceChangeColor = isPriceDrop ? '#10b981' : '#ef4444';
  const conditionText = condition === 'below' ? 'dropped below' : condition === 'above' ? 'gone above' : 'dropped to';

  const appUrl = process.env.VITE_APP_URL || 'https://pokeprice.app';
  const cardUrl = `${appUrl}/card/${cardId}`;
  const alertsUrl = `${appUrl}/alerts`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Price Alert - ${cardName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background-color: #F7F4EF;
      color: #1F2421;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-wrapper {
      width: 100%;
      background-color: #F7F4EF;
      padding: 40px 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(31, 36, 33, 0.08);
      border: 1.5px solid #E7E1D7;
    }
    .header {
      background: linear-gradient(135deg, #C4612F 0%, #A94E22 100%);
      padding: 32px 40px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px;
    }
    .alert-badge {
      display: inline-block;
      background-color: #F2E3D6;
      color: #C4612F;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .card-section {
      background-color: #FBF9F5;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
      border: 1.5px solid #E7E1D7;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .card-image {
      width: 120px;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .card-details {
      flex: 1;
    }
    .card-name {
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1F2421;
    }
    .card-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .meta-badge {
      background-color: #FFFFFF;
      border: 1px solid #E7E1D7;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: #5C635D;
    }
    .price-comparison {
      background: linear-gradient(135deg, #FFFFFF 0%, #FBF9F5 100%);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 28px;
      border: 2px solid ${priceChangeColor};
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #E7E1D7;
    }
    .price-row:last-child {
      border-bottom: none;
    }
    .price-label {
      font-size: 14px;
      color: #5C635D;
      font-weight: 500;
    }
    .price-value {
      font-size: 20px;
      font-weight: 600;
      color: #1F2421;
    }
    .price-value.old {
      text-decoration: line-through;
      opacity: 0.5;
      font-size: 16px;
    }
    .price-change {
      background-color: ${isPriceDrop ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
      color: ${priceChangeColor};
      padding: 16px 20px;
      border-radius: 10px;
      text-align: center;
      margin-top: 20px;
      font-size: 18px;
      font-weight: 700;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #C4612F 0%, #A94E22 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(196, 97, 47, 0.3);
      margin: 8px;
    }
    .cta-secondary {
      background: #FFFFFF;
      color: #C4612F;
      border: 2px solid #C4612F;
      box-shadow: none;
    }
    .button-row {
      text-align: center;
      margin: 32px 0;
    }
    .info-box {
      background-color: #F2E3D6;
      border-left: 4px solid #C4612F;
      padding: 16px 20px;
      border-radius: 8px;
      margin-top: 28px;
      font-size: 14px;
      line-height: 1.6;
      color: #5C635D;
    }
    .footer {
      background-color: #FBF9F5;
      padding: 32px 40px;
      text-align: center;
      border-top: 1.5px solid #E7E1D7;
      font-size: 13px;
      color: #5C635D;
      line-height: 1.6;
    }
    .footer a {
      color: #C4612F;
      text-decoration: none;
      font-weight: 500;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      .content {
        padding: 24px 20px;
      }
      .header {
        padding: 24px 20px;
      }
      .header h1 {
        font-size: 22px;
      }
      .card-section {
        flex-direction: column;
        text-align: center;
      }
      .card-image {
        width: 100px;
      }
      .price-comparison {
        padding: 20px;
      }
      .cta-button {
        display: block;
        margin: 8px 0;
      }
      .footer {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <h1>🔔 Price Alert Triggered!</h1>
        <p>Your target price has been reached</p>
      </div>

      <div class="content">
        <span class="alert-badge">Premium Alert</span>

        <div class="card-section">
          <img src="${cardImage}" alt="${cardName}" class="card-image" />
          <div class="card-details">
            <h2 class="card-name">${cardName}</h2>
            <div class="card-meta">
              ${setName ? `<span class="meta-badge">${setName}</span>` : ''}
              ${rarity ? `<span class="meta-badge">${rarity}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="price-comparison">
          <div class="price-row">
            <span class="price-label">Previous Price</span>
            <span class="price-value old">$${parseFloat(oldPrice).toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span class="price-label">Current Price</span>
            <span class="price-value">$${parseFloat(newPrice).toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span class="price-label">Your Target</span>
            <span class="price-value">$${parseFloat(targetPrice).toFixed(2)}</span>
          </div>

          <div class="price-change">
            ${isPriceDrop ? '↓' : '↑'} $${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(1)}%)
            <br/>
            <span style="font-size: 14px; font-weight: 500; opacity: 0.9;">
              Price has ${conditionText} your target!
            </span>
          </div>
        </div>

        <div class="button-row">
          <a href="${cardUrl}" class="cta-button">View Card Details</a>
          <a href="${alertsUrl}" class="cta-secondary cta-button">Manage Alerts</a>
        </div>

        <div class="info-box">
          <strong>💡 Pro Tip:</strong> Card prices can fluctuate quickly. Consider acting soon if you're interested in purchasing or selling.
          ${alertFrequency !== 'instant' ? `<br/><br/>You're receiving ${alertFrequency} notifications. Update your alert settings anytime.` : ''}
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1F2421;">PokéPrice Tracker</p>
        <p style="margin: 0 0 16px 0;">Premium Price Alerts for Pokémon TCG Collectors</p>

        <div style="margin: 16px 0;">
          <a href="${appUrl}">Visit Website</a> •
          <a href="${alertsUrl}">Manage Alerts</a> •
          <a href="${appUrl}/premium">Premium Features</a>
        </div>

        <p style="margin: 16px 0 0 0; font-size: 12px; opacity: 0.8;">
          You're receiving this because you created a price alert for this card.<br/>
          <a href="${alertsUrl}">Manage your alerts</a> or <a href="${appUrl}/settings">update email preferences</a>.
        </p>

        <p style="margin: 16px 0 0 0; font-size: 11px; opacity: 0.7;">
          © ${new Date().getFullYear()} PokéPrice Tracker. All rights reserved.<br/>
          This is an unofficial fan site. Pokémon © Nintendo/Creatures Inc./GAME FREAK inc.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Main handler for sending alert emails
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify API key for security
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { alertId, userId, userEmail, alertData } = req.body;

    // Validate required fields
    if (!alertId || !userId || !userEmail || !alertData) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['alertId', 'userId', 'userEmail', 'alertData']
      });
    }

    // Verify user has premium status
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data().isPremium) {
      return res.status(403).json({ error: 'User is not premium' });
    }

    // Generate email content
    const emailHtml = generateAlertEmail(alertData);
    const isPriceDrop = parseFloat(alertData.priceChange) < 0;

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PokéPrice Alerts <alerts@tcgvertex.com>',
      to: userEmail,
      subject: `🔔 Price Alert: ${alertData.cardName} ${isPriceDrop ? '📉' : '📈'} $${Math.abs(alertData.priceChange).toFixed(2)}`,
      html: emailHtml,
      tags: [
        { name: 'type', value: 'price_alert' },
        { name: 'userId', value: userId },
        { name: 'alertId', value: alertId }
      ]
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: emailResult.error
      });
    }

    // Log the email send in Firestore
    await db.collection('alertLogs').add({
      alertId,
      userId,
      cardId: alertData.cardId,
      cardName: alertData.cardName,
      oldPrice: alertData.oldPrice,
      newPrice: alertData.newPrice,
      targetPrice: alertData.targetPrice,
      condition: alertData.condition,
      priceChange: alertData.priceChange,
      percentChange: alertData.percentChange,
      emailSent: true,
      emailId: emailResult.id,
      triggeredAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update alert document
    await db.collection('priceAlerts').doc(alertId).update({
      lastTriggered: admin.firestore.FieldValue.serverTimestamp(),
      triggeredCount: admin.firestore.FieldValue.increment(1),
      notificationsSent: admin.firestore.FieldValue.increment(1)
    });

    console.log(`✅ Alert email sent successfully: ${alertData.cardName} to ${userEmail}`);

    return res.status(200).json({
      success: true,
      emailId: emailResult.id,
      message: 'Alert email sent successfully'
    });

  } catch (error) {
    console.error('Error sending alert email:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
