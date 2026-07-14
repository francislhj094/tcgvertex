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
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px', position: 'relative' }}>
      <Helmet>
        <title>Upgrade to Premium | PokéPrice Tracker</title>
        <meta name="description" content="Unlock unlimited card tracking, price alerts, and premium features for just $9.99 one-time payment." />
      </Helmet>

      {/* Decorative background glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'var(--accent-terracotta)',
        opacity: 0.08,
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'var(--accent-terracotta)',
        opacity: 0.1,
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

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
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-0.03em' }}>
          Upgrade to <span style={{ 
            background: 'linear-gradient(135deg, #FF6B6B 0%, #D93838 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>Premium</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 500 }}>
          One-time payment. Lifetime access. No monthly fees.
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '30px', 
        flexWrap: 'wrap',
        marginBottom: '60px' 
      }}>
        {/* Free Plan (Subdued) */}
        <div style={{
          flex: '1',
          minWidth: '320px',
          maxWidth: '400px',
          padding: '48px 40px',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#6B7280', fontWeight: 600 }}>Basic</h3>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: '#111827',
              lineHeight: 1
            }}>
              $0
            </div>
            <div style={{ fontSize: '0.95rem', color: '#9CA3AF', fontWeight: 500, marginTop: '8px' }}>
              Free forever
            </div>
          </div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flexGrow: 1
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4B5563', fontWeight: 500 }}>
              <CheckCircle size={22} color="#9CA3AF" weight="fill" />
              Track up to 10 cards
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4B5563', fontWeight: 500 }}>
              <CheckCircle size={22} color="#9CA3AF" weight="fill" />
              Real-time price data
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4B5563', fontWeight: 500 }}>
              <CheckCircle size={22} color="#9CA3AF" weight="fill" />
              30-day price history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF', opacity: 0.6 }}>
              <X size={22} />
              No price alerts
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF', opacity: 0.6 }}>
              <X size={22} />
              Ads displayed
            </li>
          </ul>
        </div>

        {/* Premium Plan Component */}
        <PremiumUpgrade />
      </div>
    </div>
  );
};

export default PremiumPage;
