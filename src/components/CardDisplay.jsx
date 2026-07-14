import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'phosphor-react';
import { isInVault, addToVault, removeFromVault } from '../services/vault';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { saveInitialPriceSnapshot } from '../services/firestoreHistory';

const CardDisplay = ({ id, name, image, price, rarity, affiliateLink }) => {
  const [saved, setSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToast } = useToast();
  const { user, isPremium } = useAuth();

  useEffect(() => {
    const checkVault = async () => {
      const result = await isInVault(id, user?.uid);
      setSaved(result);
    };
    checkVault();
  }, [id, user]);

  const handleVaultToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      await removeFromVault(id, user?.uid);
      setSaved(false);
      addToast(`${name} removed from watchlist`, 'warning');
    } else {
      try {
        await addToVault(id, user?.uid, isPremium);
        setSaved(true);
        addToast(`${name} added to watchlist!`, 'success');
        // Save initial price snapshot so the history chart starts today
        await saveInitialPriceSnapshot(id, price, name);
      } catch (error) {
        if (error.message === 'FREE_LIMIT_REACHED') {
          addToast(`⚠️ Free limit reached (10 cards). Upgrade to Premium for unlimited!`, 'warning');
        } else {
          addToast(`Failed to add ${name}`, 'warning');
        }
      }
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all var(--transition-smooth)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 32px rgba(196, 97, 47, 0.15)' : '0 1px 3px rgba(31, 36, 33, 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/card/${id}`} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          padding: '16px'
        }}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
            }}
          />
          {rarity && (
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--accent-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              {rarity}
            </span>
          )}
          <button
            className={`vault-btn ${saved ? 'saved' : ''}`}
            onClick={handleVaultToggle}
            title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Heart size={18} weight={saved ? 'fill' : 'regular'} />
          </button>
        </div>

        <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'var(--bg-white)'
        }}>
          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            transition: 'color 0.2s',
            minHeight: '2.6em'
          }}>
            {name}
          </h4>

          <div className="flex-between" style={{ alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500
              }}>
                Market Price
              </div>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 500,
                color: 'var(--accent-terracotta)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em'
              }}>
                ${parseFloat(price).toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500
              }}>
                Rarity
              </div>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '4px 8px',
                background: 'var(--accent-terracotta-tint)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {rarity}
              </span>
            </div>
          </div>

          <a
            href={affiliateLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-center"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontSize: '0.9rem',
              marginTop: '4px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingCart weight="bold" size={18} />
            View Best Price
          </a>
        </div>
      </Link>
    </div>
  );
};

export default CardDisplay;
