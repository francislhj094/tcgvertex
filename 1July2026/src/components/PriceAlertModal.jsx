import React, { useState } from 'react';
import { X, Bell, Lightning, CheckCircle, TrendDown, TrendUp } from 'phosphor-react';
import { createAlert, validateAlert } from '../services/priceAlerts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PriceAlertModal = ({ isOpen, onClose, card, currentPrice }) => {
  const { user, isPremium } = useAuth();
  const { addToast } = useToast();

  const [alertData, setAlertData] = useState({
    targetPrice: '',
    condition: 'below',
    alertType: 'email',
    frequency: 'instant'
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      addToast('Please log in to create price alerts', 'warning');
      onClose();
      return;
    }

    if (!isPremium) {
      addToast('Price alerts are a premium feature. Upgrade to unlock!', 'warning');
      onClose();
      return;
    }

    const alertPayload = {
      cardId: card.id,
      cardName: card.name,
      cardImage: card.images?.small || card.images?.large,
      currentPrice: currentPrice,
      targetPrice: parseFloat(alertData.targetPrice),
      condition: alertData.condition,
      alertType: alertData.alertType,
      frequency: alertData.frequency
    };

    const validation = validateAlert(alertPayload);

    if (!validation.valid) {
      addToast(validation.errors[0], 'warning');
      return;
    }

    setLoading(true);

    try {
      await createAlert(alertPayload, user.uid);
      addToast(`🔔 Price alert created! You'll be notified when ${card.name} ${getConditionText(alertData.condition)} $${alertData.targetPrice}`, 'success');
      onClose();
    } catch (error) {
      if (error.message === 'ALERT_EXISTS') {
        addToast('You already have an alert for this price', 'warning');
      } else {
        addToast('Failed to create alert. Please try again.', 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 'below': return 'drops below';
      case 'above': return 'goes above';
      case 'drops_to': return 'drops to';
      default: return '';
    }
  };

  const priceDifference = alertData.targetPrice ? (currentPrice - parseFloat(alertData.targetPrice)).toFixed(2) : 0;
  const percentDifference = alertData.targetPrice ? ((priceDifference / currentPrice) * 100).toFixed(1) : 0;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(31, 36, 33, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '540px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out',
            border: '1.5px solid var(--border-warm)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '28px 32px',
            borderBottom: '1.5px solid var(--border-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bell size={24} color="var(--accent-terracotta)" weight="fill" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', fontWeight: 500 }}>
                  Create Price Alert
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Get notified when price changes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <X size={24} weight="bold" />
            </button>
          </div>

          {/* Card Info */}
          <div style={{
            padding: '24px 32px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-warm)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={card.images?.small || card.images?.large}
                alt={card.name}
                style={{
                  width: '80px',
                  height: 'auto',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', fontWeight: 500 }}>
                  {card.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-white)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {card.set?.name}
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-white)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {card.rarity}
                  </span>
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--accent-terracotta)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Current: ${currentPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            {/* Condition Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Alert Condition
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'below', icon: TrendDown, label: 'Drops Below', color: 'var(--accent-green)' },
                  { value: 'above', icon: TrendUp, label: 'Goes Above', color: 'var(--accent-red)' },
                  { value: 'drops_to', icon: Lightning, label: 'Drops To', color: 'var(--accent-terracotta)' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAlertData({ ...alertData, condition: option.value })}
                    style={{
                      padding: '16px 12px',
                      background: alertData.condition === option.value ? option.color : 'var(--bg-secondary)',
                      color: alertData.condition === option.value ? 'white' : 'var(--text-primary)',
                      border: alertData.condition === option.value ? 'none' : '1.5px solid var(--border-warm)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <option.icon size={24} weight="bold" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Price */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Target Price
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500
                }}>
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={alertData.targetPrice}
                  onChange={(e) => setAlertData({ ...alertData, targetPrice: e.target.value })}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 32px',
                    border: '1.5px solid var(--border-warm)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.05rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                />
              </div>
              {alertData.targetPrice && (
                <div style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: parseFloat(priceDifference) > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  color: parseFloat(priceDifference) > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  fontWeight: 500
                }}>
                  {parseFloat(priceDifference) > 0 ? '↑' : '↓'} ${Math.abs(priceDifference)} ({Math.abs(percentDifference)}%)
                  {alertData.condition === 'below' && parseFloat(priceDifference) > 0 && ' - Waiting for drop'}
                  {alertData.condition === 'above' && parseFloat(priceDifference) < 0 && ' - Waiting for increase'}
                </div>
              )}
            </div>

            {/* Frequency */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Notification Frequency
              </label>
              <select
                value={alertData.frequency}
                onChange={(e) => setAlertData({ ...alertData, frequency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid var(--border-warm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'var(--bg-white)',
                  transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
              >
                <option value="instant">Instant (immediate notification)</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly summary</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !alertData.targetPrice}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px',
                fontSize: '1.05rem',
                opacity: loading || !alertData.targetPrice ? 0.6 : 1,
                cursor: loading || !alertData.targetPrice ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Alert...' : (
                <>
                  <Bell size={20} weight="fill" />
                  Create Price Alert
                </>
              )}
            </button>

            {/* Info */}
            <div style={{
              marginTop: '20px',
              padding: '14px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              border: '1px solid rgba(196, 97, 47, 0.2)'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <Lightning size={16} color="var(--accent-terracotta)" weight="fill" style={{ flexShrink: 0, marginTop: '2px' }} />
                <strong style={{ color: 'var(--accent-terracotta)' }}>Premium Feature</strong>
              </div>
              You'll receive an email notification when this alert triggers. Manage all your alerts from your dashboard.
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default PriceAlertModal;
