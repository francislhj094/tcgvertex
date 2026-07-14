import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Lightning, TrendDown, Bell, Sparkle, Shield, Star, ChartLineUp, Clock, CurrencyDollar } from 'phosphor-react';
import AuthModal from '../components/AuthModal';
import { useTranslation } from '../translations/useTranslation';

const LPPriceAlerts = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('lpPriceAlerts.title')}</title>
        <meta name="description" content={t('lpPriceAlerts.metaDescription')} />
      </Helmet>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* Minimal Top Bar */}
        <div style={{
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: '1200px', margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChartLineUp size={28} color="var(--accent-terracotta)" weight="duotone" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('lpPriceAlerts.brand')}
            </span>
          </div>
          <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            {t('lpPriceAlerts.startFree')} <Bell size={16} weight="fill" />
          </button>
        </div>

        {/* ============= HERO — Dark/Dramatic ============= */}
        <section style={{
          background: 'var(--bg-dark)',
          padding: '80px 24px 100px',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-20%', right: '10%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(196, 97, 47, 0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-30%', left: '5%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(196, 97, 47, 0.08) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }} />

          <div className="lp-hero-grid" style={{
            maxWidth: '1100px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(196, 97, 47, 0.15)', color: 'var(--accent-terracotta)',
                padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem', fontWeight: 600, marginBottom: '28px'
              }}>
                <Bell size={14} weight="fill" /> {t('lpPriceAlerts.badge')}
              </div>

              <h1 style={{
                fontSize: '3.5rem', lineHeight: 1.08, letterSpacing: '-0.03em',
                marginBottom: '24px', fontFamily: 'var(--font-heading)', fontWeight: 400,
                color: 'white'
              }}>
                {t('lpPriceAlerts.heroTitle')} <span style={{ color: 'var(--accent-terracotta)' }}>{t('lpPriceAlerts.heroTitleAccent')}</span> {t('lpPriceAlerts.heroTitleEnd')}
              </h1>

              <p style={{
                fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
                marginBottom: '36px', maxWidth: '480px'
              }}>
                {t('lpPriceAlerts.heroSubtitle')}
              </p>

              <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
                fontSize: '1.15rem', padding: '20px 40px',
                boxShadow: '0 8px 32px rgba(196, 97, 47, 0.4)'
              }}>
                {t('lpPriceAlerts.setAlert')} <ArrowRight weight="bold" size={20} />
              </button>

              <div style={{ display: 'flex', gap: '24px', marginTop: '28px', flexWrap: 'wrap' }}>
                {[t('lpPriceAlerts.benefit1'), t('lpPriceAlerts.benefit2'), t('lpPriceAlerts.benefit3')].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle size={16} weight="fill" color="var(--accent-green)" /> {text}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <img src="/lp-alerts.png" alt="Price drop alerts on your phone" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ============= PAIN POINT SECTION ============= */}
        <section style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              The Problem With <span style={{ color: 'var(--accent-terracotta)' }}>Manual Checking</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Every minute you spend manually checking eBay and TCGPlayer is a minute you could miss a deal.
            </p>
          </div>

          <div className="lp-comparison-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Without */}
            <div style={{
              padding: '40px', borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.03)'
            }}>
              <div style={{
                fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)',
                letterSpacing: '0.08em', marginBottom: '24px', textTransform: 'uppercase'
              }}>
                ❌ WITHOUT POKÉPRICE
              </div>
              {[
                'Manually refresh eBay 10x a day',
                'Miss price dips while you sleep',
                'Overpay because you don\'t know the trend',
                'No idea if your cards are going up or down',
                'Hours wasted scrolling sold listings'
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)',
                  borderBottom: i < 4 ? '1px solid rgba(239, 68, 68, 0.1)' : 'none'
                }}>
                  <TrendDown size={18} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {item}
                </div>
              ))}
            </div>

            {/* With */}
            <div style={{
              padding: '40px', borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--accent-green)', background: 'rgba(16, 185, 129, 0.03)'
            }}>
              <div style={{
                fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-green)',
                letterSpacing: '0.08em', marginBottom: '24px', textTransform: 'uppercase'
              }}>
                ✅ WITH POKÉPRICE
              </div>
              {[
                'Prices update automatically in real-time',
                'Get notified the moment a card drops',
                'See 30-day trends before you buy',
                'Know your portfolio value instantly',
                'Find the best prices with affiliate links'
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)',
                  borderBottom: i < 4 ? '1px solid rgba(16, 185, 129, 0.1)' : 'none'
                }}>
                  <CheckCircle size={18} weight="fill" color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= SPEED SECTION ============= */}
        <section style={{
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)',
          borderBottom: '1px solid var(--border-warm)', padding: '80px 24px'
        }}>
          <div className="lp-speed-grid" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
            {[
              { icon: <Clock size={36} weight="duotone" />, num: '<1 sec', label: 'Price lookup speed' },
              { icon: <CurrencyDollar size={36} weight="duotone" />, num: '50K+', label: 'Cards with live pricing' },
              { icon: <Lightning size={36} weight="duotone" />, num: 'Instant', label: 'Price drop detection' }
            ].map((s, i) => (
              <div key={i}>
                <div style={{ color: 'var(--accent-terracotta)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{s.num}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============= TESTIMONIALS ============= */}
        <section style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '48px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
            Smart Collectors <span style={{ color: 'var(--accent-terracotta)' }}>Save Money</span>
          </h2>

          <div className="lp-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Marcus L.', loc: 'Perth, AU', text: "Caught a Charizard VMAX drop at 3am. Would have completely missed it without the tracker. Saved $40 on that one card alone.", stars: 5 },
              { name: 'Emily R.', loc: 'Adelaide, AU', text: "I used to waste 30 minutes every night checking prices. Now I just glance at my dashboard. It's genuinely changed how I collect.", stars: 5 },
              { name: 'Tom W.', loc: 'Gold Coast, AU', text: "The price history charts helped me realize my Moonbreon was trending down, so I sold at the right time. Data is everything.", stars: 5 }
            ].map((t, i) => (
              <div key={i} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={18} weight="fill" color="var(--accent-terracotta)" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', flex: 1 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============= PRICING TEASER ============= */}
        <section style={{
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)',
          borderBottom: '1px solid var(--border-warm)', padding: '100px 24px'
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <Sparkle size={36} color="var(--accent-terracotta)" weight="fill" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              Start Free, Upgrade When Ready
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
              The free plan includes real-time prices, 10-card tracking, and 30-day charts.
              Need unlimited tracking and instant alerts? Go Premium for just $9.99 one-time.
            </p>

            <div style={{
              display: 'flex', gap: '16px', justifyContent: 'center',
              padding: '32px', background: 'var(--bg-white)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-warm)'
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>$0</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Free forever</div>
                <button onClick={() => setAuthOpen(true)} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  Get Started
                </button>
              </div>
              <div style={{ width: '1px', background: 'var(--border-warm)' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 500, color: 'var(--accent-terracotta)' }}>$9.99</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>one-time payment</div>
                <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  Go Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============= FINAL CTA ============= */}
        <section style={{
          background: 'var(--bg-dark)', color: 'white',
          padding: '100px 24px', textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Shield size={48} color="var(--accent-terracotta)" weight="duotone" style={{ marginBottom: '24px' }} />
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              Stop Overpaying for Cards.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '40px' }}>
              Every day you track without data is a day you risk paying too much or selling too low.
              Start tracking for free right now.
            </p>
            <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
              fontSize: '1.2rem', padding: '22px 48px',
              boxShadow: '0 8px 32px rgba(196, 97, 47, 0.4)'
            }}>
              Create Free Account <ArrowRight weight="bold" size={22} />
            </button>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '16px' }}>
              No credit card · Free forever · Cancel anytime
            </p>
          </div>
        </section>

        {/* Minimal footer */}
        <div style={{ padding: '20px 24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2025 PokéPrice Tracker · <a href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</a> · <a href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</a>
        </div>

        {/* Floating mobile CTA */}
        <div className="lp-floating-cta" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 24px', background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-warm)',
          zIndex: 999,
          display: 'none'
        }}>
          <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
            width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem'
          }}>
            Get Price Alerts Free <Bell weight="fill" size={18} />
          </button>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />


    </>
  );
};

export default LPPriceAlerts;
