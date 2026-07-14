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
    <div style={{
      flex: '1.2',
      minWidth: '340px',
      maxWidth: '440px',
      padding: '4px',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #D93838 100%)',
      borderRadius: '28px',
      boxShadow: '0 24px 64px rgba(217, 56, 56, 0.25)',
      position: 'relative',
      transform: 'scale(1.05)',
      zIndex: 10,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = 'scale(1.08)';
      e.currentTarget.style.boxShadow = '0 32px 80px rgba(217, 56, 56, 0.35)';
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 24px 64px rgba(217, 56, 56, 0.25)';
    }}>
      <div style={{
        position: 'absolute',
        top: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#111827',
        color: '#FDE68A',
        padding: '8px 24px',
        borderRadius: '99px',
        fontSize: '0.9rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        textTransform: 'uppercase'
      }}>
        <Sparkle size={16} weight="fill" color="#F59E0B" /> Lifetime Access
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '44px 40px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '12px' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#D93838', fontWeight: 700 }}>Premium</h3>
          
          <div style={{
            fontSize: '4.5rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: '#111827',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: '8px'
          }}>
            $9.99
          </div>

          <p style={{
            color: '#6B7280',
            fontSize: '1rem',
            fontWeight: 600
          }}>
            One-time payment • No subscriptions
          </p>
        </div>

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 32px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          flexGrow: 1
        }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#1F2937', fontWeight: 500 }}>
            <CheckCircle size={24} color="#D93838" weight="fill" />
            <span><strong style={{ color: '#D93838' }}>Unlimited</strong> card tracking</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#1F2937', fontWeight: 500 }}>
            <CheckCircle size={24} color="#D93838" weight="fill" />
            <span><strong style={{ color: '#D93838' }}>Instant</strong> price drop alerts</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#1F2937', fontWeight: 500 }}>
            <CheckCircle size={24} color="#D93838" weight="fill" />
            <span>90-day price history charts</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#1F2937', fontWeight: 500 }}>
            <CheckCircle size={24} color="#D93838" weight="fill" />
            <span>Ad-free experience</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: '#1F2937', fontWeight: 500 }}>
            <CheckCircle size={24} color="#D93838" weight="fill" />
            <span>Priority support</span>
          </li>
        </ul>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '18px',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #D93838 100%)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(217, 56, 56, 0.4)',
            transition: 'all 0.3s ease',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transform: 'translateY(0)'
          }}
          onMouseOver={e => {
            if(!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(217, 56, 56, 0.5)';
            }
          }}
          onMouseOut={e => {
            if(!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(217, 56, 56, 0.4)';
            }
          }}
        >
          <Lightning size={22} weight="fill" />
          {loading ? 'Processing...' : 'Upgrade Now'}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#9CA3AF',
          marginTop: '16px',
          fontWeight: 500
        }}>
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default PremiumUpgrade;
