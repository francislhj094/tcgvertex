import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Lightning, TrendUp, Sparkle, Shield, Star, ChartLineUp } from 'phosphor-react';
import AuthModal from '../components/AuthModal';
import { useTranslation } from '../translations/useTranslation';

const LPFreeTracker = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { t } = useTranslation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <Helmet>
        <title>{t('lpFreeTracker.title')}</title>
        <meta name="description" content={t('lpFreeTracker.metaDescription')} />
      </Helmet>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* Minimal Top Bar — no navigation, just branding */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChartLineUp size={28} color="var(--accent-terracotta)" weight="duotone" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('lpFreeTracker.brand')}
            </span>
          </div>
          <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            {t('lpFreeTracker.startFree')} <ArrowRight size={16} weight="bold" />
          </button>
        </div>

        {/* ============= HERO ============= */}
        <section className="lp-hero-grid" style={{
          padding: '60px 24px 80px',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--accent-terracotta-tint)', color: 'var(--accent-terracotta)',
              padding: '8px 16px', borderRadius: 'var(--radius-pill)',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '28px'
            }}>
              <Sparkle size={14} weight="fill" /> {t('lpFreeTracker.badge')}
            </div>

            <h1 style={{
              fontSize: '3.5rem', lineHeight: 1.08, letterSpacing: '-0.03em',
              marginBottom: '24px', fontFamily: 'var(--font-heading)', fontWeight: 400
            }}>
              {t('lpFreeTracker.heroTitle')} <span style={{ color: 'var(--accent-terracotta)' }}>{t('lpFreeTracker.heroTitleAccent')}</span>
            </h1>

            <p style={{
              fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7,
              marginBottom: '36px', maxWidth: '480px'
            }}>
              {t('lpFreeTracker.heroSubtitle')}
            </p>

            <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
              fontSize: '1.15rem', padding: '20px 40px',
              boxShadow: '0 8px 24px rgba(196, 97, 47, 0.3)'
            }}>
              {t('lpFreeTracker.startTrackingFree')} <ArrowRight weight="bold" size={20} />
            </button>

            <div style={{ display: 'flex', gap: '24px', marginTop: '28px', flexWrap: 'wrap' }}>
              {[t('lpFreeTracker.benefit1'), t('lpFreeTracker.benefit2'), t('lpFreeTracker.benefit3')].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={16} weight="fill" color="var(--accent-green)" /> {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-warm)'
          }}>
            <img src="/lp-collection.png" alt="Track your Pokémon card collection" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </section>

        {/* ============= SOCIAL PROOF BAR ============= */}
        <section style={{
          background: 'var(--bg-dark)', padding: '40px 24px',
          color: 'white'
        }}>
          <div className="lp-stats-bar" style={{
            maxWidth: '900px', margin: '0 auto',
            display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px',
            textAlign: 'center'
          }}>
            {[
              { num: t('lpFreeTracker.stat1Num'), label: t('lpFreeTracker.stat1Label') },
              { num: t('lpFreeTracker.stat2Num'), label: t('lpFreeTracker.stat2Label') },
              { num: t('lpFreeTracker.stat3Num'), label: t('lpFreeTracker.stat3Label') },
              { num: t('lpFreeTracker.stat4Num'), label: t('lpFreeTracker.stat4Label') }
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 500, marginBottom: '4px' }}>{s.num}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============= HOW IT WORKS ============= */}
        <section style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              {t('lpFreeTracker.howItWorksTitle')} <span style={{ color: 'var(--accent-terracotta)' }}>{t('lpFreeTracker.howItWorksTitleAccent')}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              {t('lpFreeTracker.howItWorksSubtitle')}
            </p>
          </div>

          <div className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { step: '01', icon: <Lightning size={32} weight="fill" />, title: t('lpFreeTracker.step1Title'), desc: t('lpFreeTracker.step1Desc') },
              { step: '02', icon: <TrendUp size={32} weight="fill" />, title: t('lpFreeTracker.step2Title'), desc: t('lpFreeTracker.step2Desc') },
              { step: '03', icon: <Sparkle size={32} weight="fill" />, title: t('lpFreeTracker.step3Title'), desc: t('lpFreeTracker.step3Desc') }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--accent-terracotta-tint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', color: 'var(--accent-terracotta)'
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-terracotta)', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  STEP {item.step}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============= WHAT YOU GET ============= */}
        <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)', borderBottom: '1px solid var(--border-warm)', padding: '100px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '48px', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              {t('lpFreeTracker.featuresTitle')} <span style={{ color: 'var(--accent-terracotta)' }}>{t('lpFreeTracker.featuresTitleAccent')}</span>
            </h2>

            <div className="lp-features-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left'
            }}>
              {[
                t('lpFreeTracker.feature1'),
                t('lpFreeTracker.feature2'),
                t('lpFreeTracker.feature3'),
                t('lpFreeTracker.feature4'),
                t('lpFreeTracker.feature5'),
                t('lpFreeTracker.feature6'),
                t('lpFreeTracker.feature7'),
                t('lpFreeTracker.feature8')
              ].map((feature, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 20px',
                  background: 'var(--bg-white)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-warm)',
                  fontSize: '0.95rem', color: 'var(--text-secondary)'
                }}>
                  <CheckCircle size={22} weight="fill" color="var(--accent-green)" style={{ flexShrink: 0 }} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============= TESTIMONIALS ============= */}
        <section style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '48px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
            Collectors <span style={{ color: 'var(--accent-terracotta)' }}>Love It</span>
          </h2>

          <div className="lp-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { name: 'Jake M.', loc: 'Sydney, AU', text: "Finally know what my childhood binder is actually worth. The free plan gives you everything you need to start.", stars: 5 },
              { name: 'Sarah T.', loc: 'Melbourne, AU', text: "I was checking eBay sold listings manually for hours. This does it instantly. Absolute game changer for my collection.", stars: 5 },
              { name: 'Chris D.', loc: 'Brisbane, AU', text: "Clean interface, accurate prices, and it's free? Signed up in seconds and now I check my portfolio every morning.", stars: 5 }
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

        {/* ============= FAQ ============= */}
        <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-warm)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
              Common Questions
            </h2>
            {[
              { q: 'Is it really free?', a: 'Yes. The free plan lets you track up to 10 cards with real-time prices, 30-day history, and cloud sync. No credit card required, ever.' },
              { q: 'Where do the prices come from?', a: 'We pull live market data from TCGPlayer, the largest Pokémon TCG marketplace. Prices update in real-time.' },
              { q: 'Can I use it on my phone?', a: 'Absolutely. The entire platform is mobile-optimized and works beautifully on any device.' },
              { q: 'What if I want to track more than 10 cards?', a: 'Our Pro plan ($4.99/mo) gives you unlimited tracking, price drop alerts, 90-day charts, and more. You can upgrade anytime.' }
            ].map((faq, i) => (
              <div key={i} style={{
                padding: '24px 0',
                borderBottom: i < 3 ? '1px solid var(--border-warm)' : 'none'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 600 }}>{faq.q}</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{faq.a}</p>
              </div>
            ))}
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
              {t('lpFreeTracker.ctaTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '40px' }}>
              {t('lpFreeTracker.ctaSubtitle')}
            </p>
            <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
              fontSize: '1.2rem', padding: '22px 48px',
              boxShadow: '0 8px 32px rgba(196, 97, 47, 0.4)'
            }}>
              {t('lpFreeTracker.ctaButton')} <ArrowRight weight="bold" size={22} />
            </button>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '16px' }}>
              {t('lpFreeTracker.ctaDisclaimer')}
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
          display: 'none' /* shown via CSS media query */
        }}>
          <button onClick={() => setAuthOpen(true)} className="btn-primary" style={{
            width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem'
          }}>
            Start Tracking Free <ArrowRight weight="bold" size={18} />
          </button>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />


    </>
  );
};

export default LPFreeTracker;
