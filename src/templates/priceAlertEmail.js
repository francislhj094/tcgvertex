// Premium Email Template for Price Alerts
// Clean, professional design matching the app's aesthetic

export const generatePriceAlertEmail = (alertData) => {
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

  return {
    subject: `🔔 Price Alert: ${cardName} ${isPriceDrop ? '📉' : '📈'} $${Math.abs(priceChange).toFixed(2)}`,
    html: `
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
      transition: transform 0.2s;
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
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #5C635D;
      text-decoration: none;
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
      <!-- Header -->
      <div class="header">
        <h1>🔔 Price Alert Triggered!</h1>
        <p>Your target price has been reached</p>
      </div>

      <!-- Content -->
      <div class="content">
        <span class="alert-badge">Premium Alert</span>

        <!-- Card Section -->
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

        <!-- Price Comparison -->
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
            ${isPriceDrop ? '↓' : '↑'} ${Math.abs(priceChange).toFixed(2)} USD (${Math.abs(percentChange).toFixed(1)}%)
            <br/>
            <span style="font-size: 14px; font-weight: 500; opacity: 0.9;">
              Price has ${conditionText} your target!
            </span>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="button-row">
          <a href="${cardUrl}" class="cta-button">View Card Details</a>
          <a href="${alertsUrl}" class="cta-secondary cta-button">Manage Alerts</a>
        </div>

        <!-- Info Box -->
        <div class="info-box">
          <strong>💡 Pro Tip:</strong> Card prices can fluctuate quickly. Consider acting soon if you're interested in purchasing or selling.
          ${alertFrequency !== 'instant' ? `<br/><br/>You're receiving ${alertFrequency} notifications. Update your alert settings anytime.` : ''}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1F2421;">PokéPrice Tracker</p>
        <p style="margin: 0 0 16px 0;">Premium Price Alerts for Pokémon TCG Collectors</p>

        <div class="social-links">
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
    `,
    text: `
🔔 PRICE ALERT: ${cardName}

Your price alert has been triggered!

Card: ${cardName}
${setName ? `Set: ${setName}` : ''}
${rarity ? `Rarity: ${rarity}` : ''}

PRICE UPDATE:
Previous Price: $${parseFloat(oldPrice).toFixed(2)}
Current Price:  $${parseFloat(newPrice).toFixed(2)}
Your Target:    $${parseFloat(targetPrice).toFixed(2)}

Change: ${isPriceDrop ? '↓' : '↑'} $${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(1)}%)

The price has ${conditionText} your target!

View card details: ${cardUrl}
Manage alerts: ${alertsUrl}

---
PokéPrice Tracker - Premium Price Alerts for Pokémon TCG Collectors
You're receiving this because you created a price alert for this card.
Manage your alerts: ${alertsUrl}
    `.trim()
  };
};

// Welcome email for new premium users
export const generateWelcomeEmail = (userName, userEmail) => {
  const appUrl = process.env.VITE_APP_URL || 'https://pokeprice.app';

  return {
    subject: '🎉 Welcome to Premium - Your Price Alerts Are Active!',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Premium</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background-color: #F7F4EF;
      color: #1F2421;
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
      padding: 48px 40px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0 0 12px 0;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
    }
    .feature-list {
      margin: 32px 0;
    }
    .feature {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: flex-start;
    }
    .feature-icon {
      background-color: #F2E3D6;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .feature-content h3 {
      margin: 0 0 6px 0;
      font-size: 18px;
      color: #1F2421;
    }
    .feature-content p {
      margin: 0;
      color: #5C635D;
      font-size: 14px;
      line-height: 1.5;
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
      margin: 24px 0;
    }
    .button-row {
      text-align: center;
    }
    .footer {
      background-color: #FBF9F5;
      padding: 32px 40px;
      text-align: center;
      border-top: 1.5px solid #E7E1D7;
      font-size: 13px;
      color: #5C635D;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <h1>🎉 Welcome to Premium!</h1>
        <p>Your account has been upgraded successfully</p>
      </div>

      <div class="content">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${userName || 'there'},
        </p>

        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Thank you for upgrading to Premium! You now have access to all premium features, including real-time price alerts that will be delivered directly to your inbox.
        </p>

        <div class="feature-list">
          <div class="feature">
            <div class="feature-icon">🔔</div>
            <div class="feature-content">
              <h3>Unlimited Price Alerts</h3>
              <p>Create alerts for any card and get instant email notifications when prices hit your target.</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h3>Real-Time Monitoring</h3>
              <p>We check prices every 15 minutes so you never miss a deal.</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>Advanced Portfolio Tracking</h3>
              <p>Track unlimited cards in your portfolio with detailed analytics.</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">🚀</div>
            <div class="feature-content">
              <h3>Ad-Free Experience</h3>
              <p>Enjoy a clean, distraction-free interface focused on what matters.</p>
            </div>
          </div>
        </div>

        <div class="button-row">
          <a href="${appUrl}/alerts" class="cta-button">Create Your First Alert</a>
        </div>

        <p style="margin-top: 32px; padding: 20px; background-color: #F2E3D6; border-radius: 8px; border-left: 4px solid #C4612F; font-size: 14px; line-height: 1.6;">
          <strong>💡 Getting Started:</strong> Head to any card page and click "Create Alert" to start monitoring prices. You'll receive emails whenever your conditions are met!
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #1F2421;">PokéPrice Tracker</p>
        <p style="margin: 0;">Need help? <a href="${appUrl}/contact" style="color: #C4612F; text-decoration: none;">Contact Support</a></p>
      </div>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Welcome to Premium!

Hi ${userName || 'there'},

Thank you for upgrading to Premium! You now have access to all premium features.

WHAT'S INCLUDED:
• Unlimited Price Alerts - Get instant email notifications
• Real-Time Monitoring - Prices checked every 15 minutes
• Advanced Portfolio Tracking - Unlimited cards with analytics
• Ad-Free Experience - Clean, distraction-free interface

Get started: ${appUrl}/alerts

Need help? Contact us at ${appUrl}/contact

- The PokéPrice Tracker Team
    `.trim()
  };
};
