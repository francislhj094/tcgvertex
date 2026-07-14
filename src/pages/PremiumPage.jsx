import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Lightning, ArrowLeft, CheckCircle, X } from 'phosphor-react';
import PremiumUpgrade from '../components/PremiumUpgrade';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';
import { trackViewContent, trackPurchase } from '../services/facebookPixel';

const PremiumPage = () => {
  const { isPremium, user } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { formatPrice, country } = useCountry();
  const [verifying, setVerifying] = useState(false);
  const [guestSuccess, setGuestSuccess] = useState(false);

  // Track page view for Facebook Pixel
  useEffect(() => {
    if (!isPremium) {
      // Track that user viewed the premium upgrade page
      const priceInLocalCurrency = 9.99 * country.priceMultiplier;
      trackViewContent(
        'Premium Upgrade Page',
        'Upgrade',
        priceInLocalCurrency,
        country.currency
      );
    }
  }, [isPremium, country]);

  // Handle return from Stripe checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      if (!user) {
        // Guest purchase successful
        setGuestSuccess(true);
        addToast('Payment successful! Please create an account to claim your Premium status.', 'success');
      } else if (!user.isPremium) {
        // Logged in user purchase successful
        setVerifying(true);
        const timeout = setTimeout(() => {
          setVerifying(false);
          addToast('Payment processing is taking longer than expected. Please refresh in a moment.', 'info');
          window.history.replaceState({}, document.title, '/premium');
        }, 30000);
        return () => clearTimeout(timeout);
      }
    }

    const canceled = searchParams.get('canceled');
    if (canceled === 'true') {
      addToast('Payment canceled. You can try again anytime.', 'info');
      window.history.replaceState({}, document.title, '/premium');
    }
  }, [searchParams, user, addToast]);

  // Watch for premium status change from Firestore
  useEffect(() => {
    if (verifying && user?.isPremium) {
      setVerifying(false);
      addToast('🎉 Payment successful! Premium activated!', 'success');

      // Track successful purchase for Facebook Pixel
      const sessionId = searchParams.get('session_id');
      const priceInLocalCurrency = 9.99 * country.priceMultiplier;
      trackPurchase(priceInLocalCurrency, country.currency, sessionId);

      window.history.replaceState({}, document.title, '/premium');
    }
    
    // If they were a guest who just signed up/logged in, the AuthContext 
    // will claim the purchase and they will become premium.
    if (guestSuccess && user?.isPremium) {
      setGuestSuccess(false);
    }
  }, [user?.isPremium, verifying, guestSuccess, addToast, searchParams, country]);

  // Show verifying state while waiting for webhook
  if (verifying) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
        <Helmet>
          <title>Verifying Payment | PokéPrice Tracker</title>
        </Helmet>

        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
          border: '1.5px solid var(--border-warm)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid var(--border-warm)',
            borderTop: '4px solid var(--accent-terracotta)',
            borderRadius: '50%',
            margin: '0 auto 32px',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            {t('premium.verifyingPayment')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            {t('premium.verifyingMessage')}
          </p>
        </div>
      </div>
    );
  }

  if (guestSuccess && !user) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
        <Helmet>
          <title>Claim Premium | PokéPrice Tracker</title>
        </Helmet>
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--accent-terracotta-tint) 100%)',
          border: '2px solid var(--accent-terracotta)'
        }}>
          <CheckCircle size={64} color="var(--accent-green)" weight="fill" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '32px' }}>
            You purchased Premium as a guest. Please create an account or log in with the email you used at checkout to instantly claim your Lifetime Access.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {/* The AuthModal component from Navbar usually handles this, 
                but we can just prompt them to use the top nav for now. */}
            <p style={{ fontWeight: 600, color: 'var(--accent-terracotta)' }}>
              Click "Sign In" in the top menu to create your account and activate Premium.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
        <Helmet>
          <title>Premium Status | PokéPrice Tracker</title>
        </Helmet>

        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          marginBottom: '40px',
          transition: 'color 0.2s',
          fontSize: '1rem',
          fontWeight: 500
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          <ArrowLeft weight="bold" size={20} /> {t('premium.backToHome')}
        </Link>

        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, var(--bg-white) 100%)',
          border: '2px solid var(--accent-terracotta)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'var(--accent-terracotta)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 8px 24px rgba(196, 97, 47, 0.3)'
          }}>
            <Lightning size={50} color="white" weight="fill" />
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            {t('premium.yourePremium').split(' ')[0]} <span className="text-accent">{t('premium.yourePremium').split(' ')[1]}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '32px' }}>
            {t('premium.lifetimeAccessDesc')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {t('premium.watchlistLimit')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
                {t('premium.unlimited')}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {t('premium.priceHistory')}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
                {t('premium.days180')}
              </div>
            </div>
          </div>

          <Link to="/portfolio" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            {t('nav.portfolio')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1200px' }}>
      <Helmet>
        <title>Upgrade to Premium | PokéPrice Tracker</title>
        <meta name="description" content="Unlock unlimited card tracking, price alerts, and premium features for just $9.99 one-time payment." />
      </Helmet>

      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        marginBottom: '40px',
        transition: 'color 0.2s',
        fontSize: '1rem',
        fontWeight: 500
      }}
      onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
      onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
        <ArrowLeft weight="bold" size={20} /> {t('premium.backToHome')}
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Upgrade to <span className="text-accent">Premium</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          One-time payment. Lifetime access. No monthly fees.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '60px' }}>
        {/* Free Plan */}
        <div className="glass-panel" style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Free</h3>
            <div style={{
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              marginBottom: '16px'
            }}>
              $0
            </div>
          </div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flexGrow: 1
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-green)" weight="fill" />
              Track up to 10 cards
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-green)" weight="fill" />
              Real-time price data
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-green)" weight="fill" />
              30-day price history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
              <X size={20} />
              No price alerts
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
              <X size={20} />
              Ads displayed
            </li>
          </ul>
        </div>

        {/* Premium Plan */}
        <div className="glass-panel" style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: '2px solid var(--accent-terracotta)',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--accent-terracotta-tint) 100%)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '24px',
            background: 'var(--accent-terracotta)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            Best Value
          </div>

          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--accent-terracotta)' }}>
              Premium
            </h3>
            <div style={{
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-terracotta)',
              marginBottom: '4px'
            }}>
              $9.99
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              One-time • Lifetime access
            </div>
          </div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flexGrow: 1
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              <strong>Unlimited</strong> card tracking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              <strong>Instant</strong> price drop alerts
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              90-day price history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              Ad-free experience
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              Priority support
            </li>
          </ul>
        </div>
      </div>

      <PremiumUpgrade />
    </div>
  );
};

export default PremiumPage;
