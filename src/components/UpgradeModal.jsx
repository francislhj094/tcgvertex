import React from 'react';
import { X, CheckCircle, Crown, Lightning, ChartLineUp, Bell } from 'phosphor-react';
import { useToast } from '../context/ToastContext';

const UpgradeModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    addToast('Pro upgrade coming soon! You\'ll be the first to know.', 'info');
    onClose();
  };

  const features = [
    { icon: <ChartLineUp size={20} />, text: 'Unlimited card tracking' },
    { icon: <Bell size={20} />, text: 'Real-time price drop alerts' },
    { icon: <Lightning size={20} />, text: 'Advanced arbitrage tools' },
    { icon: <Crown size={20} />, text: 'Priority customer support' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(31, 36, 33, 0.5)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000, animation: 'fadeInUp 0.2s ease-out',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 1001,
        background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--accent-terracotta)',
        boxShadow: '0 24px 64px rgba(196, 97, 47, 0.2)',
        width: '100%', maxWidth: '440px',
        overflow: 'hidden', animation: 'fadeInUp 0.3s ease-out',
      }}>
        {/* Accent Header Bar */}
        <div style={{
          background: 'var(--accent-terracotta)',
          padding: '24px 32px',
          color: 'white',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px',
            }}
          >
            <X size={20} weight="bold" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Crown size={24} weight="fill" />
            <h3 style={{ fontSize: '1.3rem', color: 'white', fontFamily: 'var(--font-heading)' }}>
              Upgrade to Pro
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Unlock the full power of your TCG portfolio
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Pricing */}
          <div style={{
            textAlign: 'center', marginBottom: '28px',
            padding: '20px', background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>$4.99</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>/month</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              Cancel anytime · 7-day free trial
            </p>
          </div>

          {/* Features */}
          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 28px 0',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {features.map((feature, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                color: 'var(--text-secondary)', fontSize: '0.95rem',
              }}>
                <span style={{ color: 'var(--accent-terracotta)', flexShrink: 0 }}>
                  <CheckCircle size={20} weight="fill" />
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{feature.icon}</span>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="btn-primary"
            style={{
              width: '100%', justifyContent: 'center', padding: '16px',
              fontSize: '1rem', gap: '8px',
            }}
          >
            <Lightning size={20} weight="fill" />
            Start 7-Day Free Trial
          </button>

          <p style={{
            textAlign: 'center', color: 'var(--text-muted)',
            fontSize: '0.75rem', marginTop: '12px',
          }}>
            No credit card required to start your trial
          </p>
        </div>
      </div>
    </>
  );
};

export default UpgradeModal;
