import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translations/useTranslation';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '16px' }}>{t('privacy.title')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        {t('privacy.lastUpdated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Information We Collect</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We collect minimal information to provide our service:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px', paddingLeft: '24px' }}>
            <li><strong>Local Storage Data:</strong> Your watchlist is stored locally in your browser</li>
            <li><strong>Usage Analytics:</strong> We use Google Analytics to understand how users interact with our site (page views, clicks, time on site)</li>
            <li><strong>Cookies:</strong> We use cookies for analytics and advertising purposes</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. How We Use Your Information</h2>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '24px' }}>
            <li>To provide and improve our card price tracking service</li>
            <li>To analyze site usage and optimize user experience</li>
            <li>To display relevant advertisements through Google AdSense</li>
            <li>To track affiliate referrals when you click "Buy Now" buttons</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. Cookies and Tracking</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We use cookies and similar tracking technologies to:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px', paddingLeft: '24px' }}>
            <li><strong>Analytics Cookies:</strong> Google Analytics tracks site usage</li>
            <li><strong>Advertising Cookies:</strong> Google AdSense displays personalized ads</li>
            <li><strong>Affiliate Cookies:</strong> Track purchases through our affiliate links (TCGPlayer, eBay)</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px' }}>
            You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>4. Third-Party Services</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            We use the following third-party services:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '24px' }}>
            <li><strong>Pokémon TCG API:</strong> For card data and pricing information</li>
            <li><strong>Google Analytics:</strong> For site analytics and usage tracking</li>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>TCGPlayer, eBay:</strong> When you click our affiliate links, these platforms may set their own cookies</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px' }}>
            Each third-party service has its own privacy policy governing their data collection and use.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>5. Data Storage and Security</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Your watchlist data is stored locally in your browser and never sent to our servers.
            We do not collect or store personal information like email addresses or passwords
            (unless you create a premium account in the future).
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>6. Affiliate Disclosure</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This site contains affiliate links to TCGPlayer, eBay, and other card marketplaces.
            When you click a "Buy Now" button and make a purchase, we may earn a commission at
            no additional cost to you. This helps us keep the service free.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>7. Children's Privacy</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Our service is intended for users age 13 and older. We do not knowingly collect
            information from children under 13.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>8. Your Rights</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            You have the right to:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px', paddingLeft: '24px' }}>
            <li>Clear your watchlist data by clearing browser local storage</li>
            <li>Opt out of analytics by using browser extensions like uBlock Origin</li>
            <li>Disable cookies in your browser settings</li>
            <li>Request data deletion by clearing your browser data</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>9. Changes to This Policy</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We may update this privacy policy from time to time. The "Last updated" date at
            the top will reflect when changes were made.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>10. Contact Us</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            If you have questions about this privacy policy, please contact us through the
            contact information on our website.
          </p>
        </section>
      </div>

      <div style={{
        marginTop: '60px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-warm)',
        textAlign: 'center'
      }}>
        <Link to="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
