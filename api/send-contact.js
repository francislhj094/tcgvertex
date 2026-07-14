// Vercel Serverless Function - Contact Form Email Handler
// Sends contact form submissions via Resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Handle contact form submissions
 * Sends email to support team with user's message
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'message']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'PokéPrice Support <support@pokeprice.app>',
      to: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
      replyTo: email,
      subject: `Contact Form: ${name}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
      background-color: #F7F4EF;
      color: #1F2421;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid #E7E1D7;
    }
    .header {
      background: linear-gradient(135deg, #C4612F 0%, #A94E22 100%);
      padding: 32px;
      color: white;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px;
    }
    .field {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E7E1D7;
    }
    .field:last-child {
      border-bottom: none;
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      color: #5C635D;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .value {
      font-size: 16px;
      color: #1F2421;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #FBF9F5;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: #5C635D;
      border-top: 1.5px solid #E7E1D7;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
    </div>

    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${name}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value">
          <a href="mailto:${email}" style="color: #C4612F; text-decoration: none;">
            ${email}
          </a>
        </div>
      </div>

      <div class="field">
        <div class="label">Message</div>
        <div class="value">${message.replace(/\n/g, '<br>')}</div>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #F2E3D6; border-radius: 8px; border-left: 4px solid #C4612F;">
        <strong style="color: #C4612F;">💡 Quick Reply:</strong><br>
        Click the email address above to respond directly to ${name}
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">PokéPrice Tracker Contact Form</p>
      <p style="margin: 8px 0 0 0; opacity: 0.8;">Timestamp: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
NEW CONTACT FORM SUBMISSION

From: ${name}
Email: ${email}

Message:
${message}

---
Reply directly to: ${email}
Received: ${new Date().toLocaleString()}
      `.trim()
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return res.status(500).json({
        error: 'Failed to send email',
        details: emailResult.error
      });
    }

    console.log(`✅ Contact form email sent: ${emailResult.id}`);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      emailId: emailResult.id
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
