import React, { useState } from 'react';
import { Lightning, CheckCircle, Sparkle } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCountry } from '../context/CountryContext';
import { getStripe, STRIPE_PRICE_ID } from '../services/stripe';
import { trackInitiateCheckout } from '../services/facebookPixel';

const PremiumUpgrade = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();
  const { country } = useCountry();

  const handleUpgrade = async () => {
    setLoading(true);

    // Track that user initiated checkout (Facebook Pixel)
    const priceInLocalCurrency = 9.99 * country.priceMultiplier;
    trackInitiateCheckout('Premium Lifetime Access', priceInLocalCurrency, country.currency);

    try {
      // Call serverless function to create Stripe checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_ID,
          userId: user ? user.uid : 'guest',
          userEmail: user ? user.email : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL missing from response');
      }

    } catch (error) {
      console.error('Upgrade error:', error);
      addToast('Failed to start checkout. Please try again.', 'warning');
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '48px',
      maxWidth: '500px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
      border: '2px solid var(--accent-terracotta)',
      boxShadow: '0 12px 40px rgba(196, 97, 47, 0.2)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--accent-terracotta)',
        color: 'white',
        padding: '8px 24px',
        borderRadius: 'var(--radius-pill)',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        boxShadow: '0 4px 12px rgba(196, 97, 47, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Sparkle size={16} weight="fill" /> Lifetime Access
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--accent-terracotta)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(196, 97, 47, 0.3)'
        }}>
          <Lightning size={40} color="white" weight="fill" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>
          Upgrade to <span className="text-accent">Premium</span>
        </h2>

        <div style={{
          fontSize: '4rem',
          fontWeight: 500,
          fontFamily: 'var(--font-heading)',
          color: 'var(--accent-terracotta)',
          marginBottom: '8px',
          letterSpacing: '-0.03em'
        }}>
          $9.99
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          fontWeight: 500
        }}>
          One-time payment • Lifetime access
        </p>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '0 0 32px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
          <CheckCircle size={24} color="var(--accent-terracotta)" weight="fill" />
          <strong>Unlimited</strong> card tracking
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
          <CheckCircle size={24} color="var(--accent-terracotta)" weight="fill" />
          <strong>Instant</strong> price drop alerts
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
          <CheckCircle size={24} color="var(--accent-terracotta)" weight="fill" />
          90-day price history charts
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
          <CheckCircle size={24} color="var(--accent-terracotta)" weight="fill" />
          Ad-free experience
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
          <CheckCircle size={24} color="var(--accent-terracotta)" weight="fill" />
          Priority support
        </li>
      </ul>

      <button
        className="btn-primary"
        onClick={handleUpgrade}
        disabled={loading}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '18px',
          fontSize: '1.1rem',
          boxShadow: '0 4px 16px rgba(196, 97, 47, 0.3)',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Upgrade Now - $9.99'}
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '16px',
        lineHeight: 1.6
      }}>
        Secure payment powered by Stripe • Instant activation
      </p>
    </div>
  );
};

export default PremiumUpgrade;
