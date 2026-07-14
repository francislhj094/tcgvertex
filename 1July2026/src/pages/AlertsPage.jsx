import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Lightning } from 'phosphor-react';
import AlertsManager from '../components/AlertsManager';
import { useTranslation } from '../translations/useTranslation';

const AlertsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1200px' }}>
      <Helmet>
        <title>Price Alerts | PokéPrice Tracker</title>
        <meta name="description" content="Manage your price alerts and get notified when cards reach your target price." />
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

      {/* Header */}
      <header style={{ marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="eyebrow-pill">
            <Bell size={14} weight="fill" /> {t('alerts.badge')}
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {t('alerts.title')} <span className="text-accent">{t('alerts.titleAccent')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          {t('alerts.subtitle')}
        </p>
      </header>

      {/* Info Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, rgba(242, 227, 214, 0.3) 100%)',
        border: '1.5px solid rgba(196, 97, 47, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--accent-terracotta)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Lightning size={24} color="white" weight="fill" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>
            How Price Alerts Work
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Set target prices on any card. We'll monitor prices 24/7 and send you an instant email notification when your conditions are met. Create alerts from any card detail page.
          </p>
        </div>
      </div>

      {/* Alerts Manager Component */}
      <AlertsManager />
    </div>
  );
};

export default AlertsPage;
