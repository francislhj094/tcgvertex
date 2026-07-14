import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightning, Heart, ChartLine, Users, Target, Sparkle } from 'phosphor-react';
import { useTranslation } from '../translations/useTranslation';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
      <Helmet>
        <title>About Us | PokéPrice Tracker</title>
        <meta name="description" content="Learn about PokéPrice Tracker, the premium platform for tracking Pokémon TCG card prices and managing your collection." />
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

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '60px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
      }}>
        <img src="/about-hero.png" alt="PokéPrice Tracker Workspace" style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(31,36,33,0.85) 0%, rgba(31,36,33,0.3) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            <span className="eyebrow-pill" style={{ background: 'rgba(196, 97, 47, 0.2)', color: 'var(--accent-terracotta)' }}>
              <Sparkle size={14} weight="fill" /> About Us
            </span>
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', letterSpacing: '-0.02em', color: 'white' }}>
            Professional-Grade <span style={{ color: 'var(--accent-terracotta)' }}>Price Tracking</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Built for serious Pokémon TCG collectors and investors who need real-time data, advanced analytics, and smart alerts.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="glass-panel" style={{
        padding: '48px',
        marginBottom: '60px',
        background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, var(--bg-white) 100%)',
        border: '1.5px solid rgba(196, 97, 47, 0.2)'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--accent-terracotta)' }}>
          Our Mission
        </h2>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: '0' }}>
          We believe every collector deserves access to professional-grade market intelligence. Whether you're building your first collection or managing a portfolio worth thousands, PokéPrice Tracker gives you the data and tools you need to make smart decisions, buy at the right time, and track your investment performance.
        </p>
      </div>

      {/* What Makes Us Different */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center' }}>
          What Makes Us <span className="text-accent">Different</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px'
        }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <ChartLine size={28} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Investment-Grade Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Interactive charts, portfolio tracking, gain/loss analysis, and performance rankings. We bring Wall Street analytics to Pokémon cards.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Lightning size={28} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Real-Time Alerts</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Set custom price targets and get instant email notifications when cards drop. Never miss a buying opportunity again.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Target size={28} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Multi-Marketplace Comparison</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Compare prices across TCGPlayer, eBay, and CardMarket instantly. Our smart engine finds you the absolute best deal every time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: '60px' }}>
        <div className="glass-panel" style={{
          padding: '48px',
          background: 'var(--bg-secondary)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>
            Trusted by Collectors <span className="text-accent">Worldwide</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px'
          }}>
            <div>
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
                Cards Tracked Daily
              </div>
            </div>

            <div>
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
                Real-Time Updates
              </div>
            </div>

            <div>
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
                Price Accuracy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center' }}>
          Our <span className="text-accent">Values</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Heart size={24} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Collector-First Design</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Every feature is designed with collectors in mind. Clean interface, powerful tools, zero clutter.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={24} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Transparency</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Clear pricing, honest data sources, no hidden fees. You always know exactly what you're getting.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkle size={24} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Continuous Improvement</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                We're constantly adding new features, improving performance, and listening to user feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="glass-panel" style={{
        padding: '48px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
        border: '1.5px solid var(--border-warm)'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
          Ready to get started?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Join thousands of collectors making smarter decisions with real-time data and professional analytics.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/market" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            Start Tracking Free
          </Link>
          <Link to="/premium" className="btn-outline" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            View Premium Features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
