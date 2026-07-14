import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendUp, ArrowRight, CheckCircle, MagnifyingGlass, Sparkle, Lightning, Bell } from 'phosphor-react';
import CardDisplay from '../components/CardDisplay';
import CardSkeleton from '../components/CardSkeleton';
import { fetchTrendingCards, buildAffiliateLink } from '../services/api';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { STRIPE_PRICE_ID } from '../services/stripe';
import { trackInitiateCheckout } from '../services/facebookPixel';

const LandingPage = () => {
  const [trendingCards, setTrendingCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { t } = useTranslation();
  const { country, formatPrice } = useCountry();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    setLoadingCheckout(true);
    const priceInLocalCurrency = 9.99 * country.priceMultiplier;
    trackInitiateCheckout('Premium Lifetime Access (Homepage)', priceInLocalCurrency, country.currency);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_ID,
          userId: user ? user.uid : 'guest',
          userEmail: user ? user.email : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      addToast('Failed to start checkout. Please try again.', 'warning');
      setLoadingCheckout(false);
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const cards = await fetchTrendingCards();
      setTrendingCards(cards);
      setLoading(false);
    };
    loadCards();
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Helmet>
        <title>PokéPrice Tracker | Real-Time Pokémon TCG Card Prices</title>
        <meta name="description" content="Track Pokémon TCG card prices in real-time. View pricing data, watchlist cards, and get instant price drop alerts." />
        <meta property="og:title" content="PokéPrice Tracker | Real-Time Pokémon TCG Card Prices" />
        <meta property="og:description" content="Track Pokémon TCG card prices in real-time. View pricing data, watchlist cards, and get instant price drop alerts." />
      </Helmet>
      {/* Premium Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-warm)',
        padding: 'clamp(60px, 10vw, 100px) 24px clamp(80px, 12vw, 120px)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 'min(500px, 80vw)',
          height: 'min(500px, 80vw)',
          background: 'radial-gradient(circle, rgba(196, 97, 47, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 'min(400px, 60vw)',
          height: 'min(400px, 60vw)',
          background: 'radial-gradient(circle, rgba(196, 97, 47, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ width: '100%', maxWidth: '1000px', boxSizing: 'border-box', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 16px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span className="eyebrow-pill" style={{
              background: 'linear-gradient(135deg, var(--accent-terracotta-tint), rgba(242, 227, 214, 0.5))',
              boxShadow: '0 2px 8px rgba(196, 97, 47, 0.1)'
            }}>
              <Lightning size={14} weight="fill" /> {t('home.hero.badge')}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.4rem, 6vw, 4.5rem)',
            marginBottom: '28px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {t('home.hero.headline')} <br className="mobile-only" /><span className="text-accent">{t('home.hero.headlineAccent')}</span> <br className="mobile-only" />{t('home.hero.headlineEnd')}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.35rem)',
            color: 'var(--text-secondary)',
            marginBottom: '48px',
            fontWeight: 400,
            lineHeight: 1.65,
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box',
            margin: '0 auto 48px',
            padding: '0',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {t('home.hero.subtitle')}
          </p>

          <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <button onClick={() => setAuthModalOpen(true)} className="btn-primary" style={{
              fontSize: '1.15rem',
              padding: '18px 36px',
              boxShadow: '0 4px 16px rgba(196, 97, 47, 0.25)',
              border: 'none',
              cursor: 'pointer'
            }}>
              {t('home.hero.ctaPrimary')} <ArrowRight weight="bold" size={20} />
            </button>
            <a href="#pricing" className="btn-outline" style={{
              fontSize: '1.15rem',
              padding: '18px 36px'
            }}>
              {t('home.hero.ctaSecondary')}
            </a>
          </div>

          {/* Hero Image */}
          <div style={{
            marginBottom: '64px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(196, 97, 47, 0.15)',
            border: '1px solid var(--border-warm)'
          }}>
            <img src="/hero-cards.png" alt="Premium Pokémon Cards" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            opacity: 0.7
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              {t('home.hero.trustFree')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              {t('home.hero.trustNoCard')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
              {t('home.hero.trustCancel')}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats Section */}
      <section className="container" style={{ padding: '80px 24px', maxWidth: '1100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          <div className="glass-panel" style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-terracotta)',
              marginBottom: '8px'
            }}>
              50K+
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {t('home.stats.cardsTracked')}
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-terracotta)',
              marginBottom: '8px'
            }}>
              24/7
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {t('home.stats.realTime')}
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-terracotta)',
              marginBottom: '8px'
            }}>
              98%
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {t('home.stats.accuracy')}
            </div>
          </div>
        </div>

        {/* Trending Cards Section */}
        <div className="flex-between" style={{ marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '12px', fontSize: 'clamp(1.5rem, 5vw, 2.75rem)' }}>
              {t('home.trending.title')} <span className="text-accent">{t('home.trending.titleAccent')}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
              {t('home.trending.subtitle')}
            </p>
          </div>
          <Link to="/market" className="btn-outline" style={{ padding: '14px 28px' }}>
            {t('home.trending.viewAll')} <ArrowRight weight="bold" />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            trendingCards.slice(0, 4).map(card => {
              const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
              return (
                <CardDisplay
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  image={card.images?.large || card.images?.small}
                  price={price}
                  rarity={card.rarity || 'Promo'}
                  affiliateLink={buildAffiliateLink(card.tcgplayer?.url)}
                />
              );
            })
          )}
        </div>
      </section>

      {/* Premium Features Section */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-warm)',
        borderBottom: '1px solid var(--border-warm)',
        padding: '100px 24px'
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: 'clamp(1.5rem, 5vw, 2.75rem)' }}>
              {t('home.features.title')} <span className="text-accent">{t('home.features.titleAccent')}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '40px'
          }}>
            {/* Feature 1 - Price Alerts */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-warm)' }}>
                <img src="/feature-alerts.png" alt="Instant Price Alerts" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Bell size={32} color="var(--accent-terracotta)" weight="fill" />
              </div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{t('home.features.priceAlerts.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('home.features.priceAlerts.description')}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-terracotta)',
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                {t('common.learnMore')} <ArrowRight size={16} weight="bold" />
              </div>
            </div>

            {/* Feature 2 - Historical Charts */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-warm)' }}>
                <img src="/feature-charts.png" alt="Historical Price Charts" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <TrendUp size={32} color="var(--accent-terracotta)" weight="fill" />
              </div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{t('home.features.priceHistory.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('home.features.priceHistory.description')}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-terracotta)',
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                {t('common.learnMore')} <ArrowRight size={16} weight="bold" />
              </div>
            </div>

            {/* Feature 3 - Portfolio Analytics */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-warm)' }}>
                <img src="/feature-portfolio.png" alt="Portfolio Analytics" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <Sparkle size={32} color="var(--accent-terracotta)" weight="fill" />
              </div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{t('home.features.portfolio.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('home.features.portfolio.description')}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-terracotta)',
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                {t('common.learnMore')} <ArrowRight size={16} weight="bold" />
              </div>
            </div>

            {/* Feature 4 - Multi-Marketplace Comparison */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-warm)' }}>
                <img src="/feature-compare.png" alt="Multi-Marketplace Comparison" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <MagnifyingGlass size={32} color="var(--accent-terracotta)" weight="fill" />
              </div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{t('home.features.marketplace.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('home.features.marketplace.description')}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-terracotta)',
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                {t('common.learnMore')} <ArrowRight size={16} weight="bold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section id="pricing" className="container" style={{ padding: '100px 24px', maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="eyebrow-pill" style={{ marginBottom: '20px' }}>
            <Sparkle size={14} weight="fill" /> {t('home.pricing.badge')}
          </span>
          <h2 style={{ marginBottom: '20px', fontSize: 'clamp(1.5rem, 5vw, 2.75rem)' }}>
            {t('home.pricing.title')} <span className="text-accent">{t('home.pricing.titleAccent')}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('home.pricing.subtitle')}
          </p>
        </div>

        <div className="flex-center pricing-cards" style={{ gap: '40px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* Free Tier */}
          <div className="glass-panel" style={{
            padding: '48px',
            flex: '1 1 360px',
            maxWidth: '440px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                padding: '6px 14px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {t('home.pricing.free.name')}
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '12px', fontWeight: 500 }}>{t('home.pricing.free.name')}</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 400, fontFamily: 'var(--font-heading)' }}>
                {t('home.pricing.free.price')}<span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 300 }}></span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>
                {t('home.pricing.free.description')}
              </p>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              flexGrow: 1,
              color: 'var(--text-secondary)'
            }}>
              {t('home.pricing.free.features').map((feature, index) => (
                <li key={index} className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px' }}>
                  <CheckCircle color="var(--accent-green)" weight="fill" size={22} />
                  {feature}
                </li>
              ))}
            </ul>
            <button onClick={() => setAuthModalOpen(true)} className="btn-outline" style={{
              width: '100%',
              justifyContent: 'center',
              padding: '16px',
              border: '1.5px solid var(--border-warm)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              {t('home.pricing.free.cta')}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel" style={{
            padding: '48px',
            flex: '1 1 360px',
            maxWidth: '440px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            position: 'relative',
            border: '2px solid var(--accent-terracotta)',
            boxShadow: '0 12px 40px rgba(196, 97, 47, 0.2)',
            background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)'
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
              <Sparkle size={16} weight="fill" /> {t('home.pricing.premium.badge')}
            </div>
            <div>
              <div style={{
                display: 'inline-flex',
                padding: '6px 14px',
                background: 'var(--accent-terracotta-tint)',
                color: 'var(--accent-terracotta)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Premium
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '12px', fontWeight: 500, color: 'var(--accent-terracotta)' }}>
                {t('home.pricing.premium.name')}
              </h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 400, fontFamily: 'var(--font-heading)' }}>
                {formatPrice(9.99)}<span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 300 }}> {t('home.pricing.premium.priceNote')}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>
                {t('home.pricing.premium.description')}
              </p>
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
              {t('home.pricing.premium.features').map((feature, index) => (
                <li key={index} className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px' }}>
                  <CheckCircle color="var(--accent-terracotta)" weight="fill" size={22} />
                  <span dangerouslySetInnerHTML={{ __html: feature }} />
                </li>
              ))}
            </ul>
            <button onClick={handleStripeCheckout} disabled={loadingCheckout} className="btn-primary" style={{
              width: '100%',
              justifyContent: 'center',
              padding: '16px',
              fontSize: '1.05rem',
              boxShadow: '0 4px 16px rgba(196, 97, 47, 0.3)',
              border: 'none',
              cursor: loadingCheckout ? 'not-allowed' : 'pointer',
              opacity: loadingCheckout ? 0.7 : 1
            }}>
              {loadingCheckout ? 'Processing...' : t('home.pricing.premium.cta')}
            </button>
            <p style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginTop: '-12px'
            }}>
              {t('home.pricing.premium.note')}
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure Section */}
      <section id="affiliate" className="container" style={{ padding: '60px 24px', maxWidth: '900px' }}>
        <div className="glass-panel" style={{
          padding: '40px',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-warm)'
        }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '20px', textAlign: 'center' }}>
            {t('home.affiliate.title')}
          </h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
            <p style={{ marginBottom: '16px' }}>
              {t('home.affiliate.intro')}
            </p>
            <p style={{ marginBottom: '16px' }}>
              {t('home.affiliate.help')}
            </p>
            <p style={{ marginBottom: '0' }}>
              <strong>{t('home.affiliate.commitment')}</strong> {t('home.affiliate.commitmentText')}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        background: 'var(--bg-dark)',
        color: 'white',
        padding: '100px 24px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}>
            {t('home.cta.title')}
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            marginBottom: '40px',
            lineHeight: 1.7
          }}>
            {t('home.cta.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setAuthModalOpen(true)} className="btn-primary" style={{ fontSize: '1.15rem', padding: '18px 36px', border: 'none', cursor: 'pointer' }}>
              {t('home.cta.startFree')} <ArrowRight weight="bold" size={20} />
            </button>
            <a href="#pricing" className="btn-outline" style={{
              fontSize: '1.15rem',
              padding: '18px 36px',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white'
            }}>
              {t('home.cta.viewPricing')}
            </a>
          </div>
        </div>
      </section>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode="signup" />
    </div>
  );
};

export default LandingPage;
