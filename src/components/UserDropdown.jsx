import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, CaretDown, SignOut, Gear, Sparkle, ShieldCheck } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const UserDropdown = () => {
  const { user, logout, isPremium } = useAuth();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      addToast('Logged out successfully', 'info');
    } catch {
      addToast('Error logging out', 'warning');
    }
  };

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px 6px 6px',
          background: isOpen ? 'var(--bg-white)' : 'var(--bg-secondary)',
          border: '1.5px solid var(--border-warm)',
          borderRadius: 'var(--radius-pill)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseOver={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
        }}
        onMouseOut={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-warm)';
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--accent-terracotta)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '1rem',
        }}>
          {firstLetter}
        </div>
        <span style={{ 
          fontWeight: 500, 
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100px'
        }}>
          {user.name}
        </span>
        <CaretDown size={14} weight="bold" color="var(--text-muted)" style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: '240px',
          background: 'var(--bg-white)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 12px 32px rgba(31, 36, 33, 0.1)',
          padding: '8px',
          zIndex: 999,
          animation: 'dropdownFadeIn 0.15s ease-out',
          transformOrigin: 'top right'
        }}>
          <style>{`
            @keyframes dropdownFadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(-8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .dropdown-item {
              display: flex;
              align-items: center;
              gap: 12px;
              width: 100%;
              padding: 12px 16px;
              border: none;
              background: transparent;
              color: var(--text-primary);
              font-size: 0.95rem;
              font-weight: 500;
              border-radius: var(--radius-sm);
              cursor: pointer;
              transition: all 0.2s;
              text-align: left;
              text-decoration: none;
            }
            .dropdown-item:hover {
              background: var(--bg-secondary);
            }
            .dropdown-divider {
              height: 1px;
              background: var(--border-warm);
              margin: 8px 0;
            }
          `}</style>

          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
            {isPremium ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>
                <ShieldCheck size={16} weight="fill" /> Premium Member
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginTop: '8px' }}>
                Free Plan
              </div>
            )}
          </div>

          <div className="dropdown-divider" />

          <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <Gear size={20} color="var(--text-secondary)" />
            Account Settings
          </Link>

          {!isPremium && (
            <Link to="/premium" className="dropdown-item" onClick={() => setIsOpen(false)} style={{ color: 'var(--accent-terracotta)' }}>
              <Sparkle size={20} weight="fill" />
              Upgrade to Premium
            </Link>
          )}

          <div className="dropdown-divider" />

          <button className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--error, #e53e3e)' }}>
            <SignOut size={20} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
