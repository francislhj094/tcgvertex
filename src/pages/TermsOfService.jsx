import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translations/useTranslation';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '16px' }}>{t('terms.title')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        {t('terms.lastUpdated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            By accessing and using PokéPrice Tracker, you accept and agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. Description of Service</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            PokéPrice Tracker is a free card price tracking tool that provides real-time market
            data for Pokémon Trading Card Game cards. We aggregate pricing information from
            third-party sources and provide affiliate links to purchase cards.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. Unofficial Fan Site</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This is an unofficial fan site. We are not affiliated with, endorsed by, or
            sponsored by Nintendo, Creatures Inc., GAME FREAK inc., or The Pokémon Company.
            Pokémon and all related properties are © their respective owners.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>4. Use of Service</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            You agree to use the service only for lawful purposes. You may not:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '24px' }}>
            <li>Attempt to scrape, harvest, or copy data from our site using automated tools</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Use the service for any fraudulent or illegal purpose</li>
            <li>Impersonate another person or entity</li>
            <li>Transmit viruses, malware, or other harmful code</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>5. Price Information</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We strive to provide accurate pricing information, but we cannot guarantee the
            accuracy, completeness, or timeliness of prices displayed. Prices are provided
            by third-party sources and may not reflect current market conditions. Always verify
            pricing on the seller's website before making a purchase.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>6. Affiliate Relationships</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We participate in affiliate programs with TCGPlayer, eBay, and other card marketplaces.
            When you click a "Buy Now" button and make a purchase, we may earn a commission at
            no additional cost to you. This does not influence the prices you see or pay.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>7. Watchlist and Local Storage</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Your watchlist is stored locally in your browser. We are not responsible for loss
            of watchlist data due to browser clearing, device changes, or technical issues.
            Free users can track up to 10 cards. Premium users have unlimited tracking.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>8. Premium Subscriptions</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            When premium subscriptions become available:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '24px' }}>
            <li><strong>Billing:</strong> Premium subscriptions are $4.99/month, billed monthly</li>
            <li><strong>Cancellation:</strong> You may cancel anytime. No refunds for partial months</li>
            <li><strong>Changes:</strong> We reserve the right to change pricing with 30 days notice</li>
            <li><strong>Free Trial:</strong> 7-day free trial for new premium users. Cancel before trial ends to avoid charges</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>9. Disclaimer of Warranties</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            We do not warrant that the service will be uninterrupted, error-free, or free of
            viruses or other harmful components.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>10. Limitation of Liability</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
            OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
            GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>11. Third-Party Links</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Our service contains links to third-party websites (TCGPlayer, eBay, etc.).
            We are not responsible for the content, privacy policies, or practices of these
            third-party sites. Your use of third-party sites is at your own risk.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>12. Intellectual Property</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Card images, names, and data are owned by their respective copyright holders.
            Our website design, code, and original content are protected by copyright.
            You may not copy, modify, or distribute our original content without permission.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>13. Termination</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We reserve the right to terminate or suspend your access to the service at any time,
            without notice, for conduct that we believe violates these Terms of Service or is
            harmful to other users or the service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>14. Changes to Terms</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We may update these Terms of Service at any time. Your continued use of the service
            after changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>15. Governing Law</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            These Terms shall be governed by and construed in accordance with the laws of
            your jurisdiction, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>16. Contact</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Questions about these Terms of Service? Contact us through the information
            provided on our website.
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

export default TermsOfService;
