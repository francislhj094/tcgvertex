import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trash, ToggleLeft, ToggleRight, TrendDown, TrendUp, Lightning, Plus, CloudArrowUp } from 'phosphor-react';
import {
  getUserAlerts,
  deleteAlert,
  toggleAlert,
  getAlertStats,
  subscribeToUserAlerts
} from '../services/firestoreAlerts';
import { getAlerts as getLocalAlerts, migrateLocalAlertsToFirestore } from '../services/priceAlerts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AlertsManager = () => {
  const { user, isPremium } = useAuth();
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all'); // all, enabled, disabled
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    if (user) {
      loadAlerts();

      // Set up real-time listener for alerts
      const unsubscribe = subscribeToUserAlerts(user.uid, (updatedAlerts) => {
        setAlerts(updatedAlerts);
        updateStats(updatedAlerts);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const userAlerts = await getUserAlerts(user.uid);
      setAlerts(userAlerts);
      updateStats(userAlerts);

      // Check if there are local alerts to migrate
      await checkLocalAlertsMigration();
    } catch (error) {
      console.error('Error loading alerts:', error);
      addToast('Failed to load alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (alertsList) => {
    const statsData = {
      total: alertsList.length,
      enabled: alertsList.filter((a) => a.enabled).length,
      disabled: alertsList.filter((a) => !a.enabled).length,
      triggered: alertsList.filter((a) => a.lastTriggered !== null).length,
      byCondition: {
        below: alertsList.filter((a) => a.condition === 'below').length,
        above: alertsList.filter((a) => a.condition === 'above').length,
        drops_to: alertsList.filter((a) => a.condition === 'drops_to').length
      }
    };
    setStats(statsData);
  };

  const checkLocalAlertsMigration = async () => {
    try {
      const localAlerts = getLocalAlerts(user.uid);

      if (localAlerts && localAlerts.length > 0) {
        // Show migration prompt
        console.log(`Found ${localAlerts.length} local alerts to migrate`);
        // Auto-migrate could be triggered here or via a button
      }
    } catch (error) {
      console.error('Error checking local alerts:', error);
    }
  };

  const handleMigrateLocalAlerts = async () => {
    try {
      setMigrating(true);
      const localAlerts = getLocalAlerts(user.uid);

      if (!localAlerts || localAlerts.length === 0) {
        addToast('No local alerts to migrate', 'info');
        return;
      }

      const results = await migrateLocalAlertsToFirestore(user.uid, localAlerts);

      addToast(
        `Migrated ${results.success} alerts successfully! ${results.skipped} skipped (duplicates).`,
        'success'
      );

      // Reload alerts after migration
      await loadAlerts();
    } catch (error) {
      console.error('Migration error:', error);
      addToast('Failed to migrate alerts', 'error');
    } finally {
      setMigrating(false);
    }
  };

  const handleDelete = async (alertId, cardName) => {
    if (window.confirm(`Delete price alert for ${cardName}?`)) {
      try {
        await deleteAlert(alertId);
        addToast('Price alert deleted', 'info');
      } catch (error) {
        console.error('Error deleting alert:', error);
        addToast('Failed to delete alert', 'error');
      }
    }
  };

  const handleToggle = async (alertId) => {
    try {
      const result = await toggleAlert(alertId);
      addToast(
        result.enabled ? '✓ Alert enabled' : 'Alert paused',
        result.enabled ? 'success' : 'info'
      );
    } catch (error) {
      console.error('Error toggling alert:', error);
      addToast('Failed to update alert', 'error');
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'below':
      case 'drops_to':
        return <TrendDown size={18} weight="bold" />;
      case 'above':
        return <TrendUp size={18} weight="bold" />;
      default:
        return <Bell size={18} weight="bold" />;
    }
  };

  const getConditionText = (condition, targetPrice) => {
    switch (condition) {
      case 'below':
        return `Drops below $${targetPrice.toFixed(2)}`;
      case 'above':
        return `Goes above $${targetPrice.toFixed(2)}`;
      case 'drops_to':
        return `Drops to $${targetPrice.toFixed(2)}`;
      default:
        return `$${targetPrice.toFixed(2)}`;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'enabled') return alert.enabled;
    if (filter === 'disabled') return !alert.enabled;
    return true;
  });

  if (!user) {
    return (
      <div className="glass-panel" style={{
        padding: '60px 40px',
        textAlign: 'center',
        border: '1.5px solid var(--border-warm)'
      }}>
        <Bell size={60} color="var(--text-muted)" weight="duotone" style={{ marginBottom: '20px' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Log In to Manage Alerts</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Create price alerts and get notified when cards reach your target price
        </p>
        <button className="btn-primary" style={{ padding: '14px 28px' }}>
          Log In
        </button>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="glass-panel" style={{
        padding: '48px 40px',
        textAlign: 'center',
        border: '2px solid var(--accent-terracotta)',
        background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, var(--bg-white) 100%)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--accent-terracotta)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(196, 97, 47, 0.3)'
        }}>
          <Lightning size={40} color="white" weight="fill" />
        </div>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>
          Upgrade to Create Price Alerts
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 28px' }}>
          Get instant email notifications when your favorite cards drop to your target price. Never miss a deal!
        </p>
        <Link to="/premium" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
          Upgrade to Premium - $9.99
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-panel" style={{
        padding: '60px 40px',
        textAlign: 'center',
        border: '1.5px solid var(--border-warm)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--border-warm)',
          borderTopColor: 'var(--accent-terracotta)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your alerts...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Overview */}
      {stats && stats.total > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          <div className="glass-panel" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
            border: '1.5px solid var(--border-warm)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Total Alerts
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-terracotta)', fontFamily: 'var(--font-heading)' }}>
              {stats.total}
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-white) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Active
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>
              {stats.enabled}
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-white) 100%)',
            border: '1.5px solid rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Triggered
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>
              {stats.triggered}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {alerts.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-warm)',
          width: 'fit-content'
        }}>
          {[
            { value: 'all', label: `All (${stats?.total || 0})` },
            { value: 'enabled', label: `Active (${stats?.enabled || 0})` },
            { value: 'disabled', label: `Paused (${stats?.disabled || 0})` }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                padding: '10px 20px',
                background: filter === tab.value ? 'var(--accent-terracotta)' : 'transparent',
                color: filter === tab.value ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.9rem',
                fontWeight: filter === tab.value ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 40px',
          textAlign: 'center',
          border: '1.5px solid var(--border-warm)'
        }}>
          <Bell size={80} color="var(--text-muted)" weight="duotone" style={{ marginBottom: '20px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            {filter === 'all' ? 'No Price Alerts Yet' : `No ${filter} alerts`}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Create your first price alert on any card detail page to get notified when prices drop
          </p>
          <Link to="/market" className="btn-primary">
            <Plus size={20} weight="bold" />
            Browse Cards
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: '1.5px solid var(--border-warm)',
                background: alert.enabled ? 'var(--bg-white)' : 'var(--bg-secondary)',
                opacity: alert.enabled ? 1 : 0.7,
                transition: 'all 0.2s'
              }}
            >
              {/* Card Image */}
              <Link to={`/card/${alert.cardId}`}>
                <img
                  src={alert.cardImage}
                  alt={alert.cardName}
                  style={{
                    width: '60px',
                    height: 'auto',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </Link>

              {/* Alert Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  to={`/card/${alert.cardId}`}
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    marginBottom: '6px',
                    display: 'block',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {alert.cardName}
                </Link>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getConditionIcon(alert.condition)}
                    {getConditionText(alert.condition, alert.targetPrice)}
                  </span>
                  <span>•</span>
                  <span>Current: ${alert.currentPrice.toFixed(2)}</span>
                  <span>•</span>
                  <span style={{ textTransform: 'capitalize' }}>{alert.frequency}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleToggle(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: alert.enabled ? 'var(--accent-green)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s'
                  }}
                  title={alert.enabled ? 'Pause alert' : 'Enable alert'}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  {alert.enabled ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} weight="fill" />}
                </button>
                <button
                  onClick={() => handleDelete(alert.id, alert.cardName)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: 'var(--accent-red)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s'
                  }}
                  title="Delete alert"
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AlertsManager;
