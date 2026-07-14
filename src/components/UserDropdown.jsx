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
          padding: '6px 16px 6px 6px',
          background: isOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '99px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.02)',
          flexShrink: 0,
        }}
        onMouseOver={e => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
          }
        }}
        onMouseOut={e => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
          }
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #D93838 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px rgba(217, 56, 56, 0.4)',
        }}>
          {firstLetter}
        </div>
        <span style={{ 
          fontWeight: 600, 
          fontSize: '0.95rem',
          color: '#1F2937',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '120px'
        }}>
          {user.name || 'User'}
        </span>
        <CaretDown size={16} weight="bold" color="#6B7280" style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          right: 0,
          minWidth: '260px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          padding: '8px',
          zIndex: 999,
          animation: 'dropdownMenuFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'top right'
        }}>
          <style>{`
            @keyframes dropdownMenuFadeIn {
              from { opacity: 0; transform: scale(0.96) translateY(-10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .dropdown-item-premium {
              display: flex;
              align-items: center;
              gap: 12px;
              width: 100%;
              padding: 12px 16px;
              border: none;
              background: transparent;
              color: #4B5563;
              font-size: 0.95rem;
              font-weight: 500;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: left;
              text-decoration: none;
            }
            .dropdown-item-premium:hover {
              background: rgba(0,0,0,0.03);
              color: #111827;
              transform: translateX(4px);
            }
            .dropdown-divider-premium {
              height: 1px;
              background: linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent);
              margin: 8px 0;
            }
            .premium-badge {
              background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%);
              color: #78350F;
              padding: 4px 10px;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 2px 10px rgba(245, 158, 11, 0.2);
            }
          `}</style>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#111827', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>{user.name}</span>
            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>{user.email}</span>
            <div style={{ marginTop: '10px' }}>
              {isPremium ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} className="premium-badge">
                  <ShieldCheck size={16} weight="fill" /> Premium Member
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', color: '#4B5563', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Free Plan
                </div>
              )}
            </div>
          </div>

          <Link to="/profile" className="dropdown-item-premium" onClick={() => setIsOpen(false)}>
            <Gear size={20} weight="duotone" color="#6B7280" />
            Account Settings
          </Link>

          {!isPremium && (
            <Link to="/premium" className="dropdown-item-premium" onClick={() => setIsOpen(false)} style={{ color: '#D93838', fontWeight: 600 }}>
              <Sparkle size={20} weight="duotone" color="#D93838" />
              Upgrade to Premium
            </Link>
          )}

          <div className="dropdown-divider-premium" />

          <button className="dropdown-item-premium" onClick={handleLogout} style={{ color: '#EF4444' }}>
            <SignOut size={20} weight="duotone" color="#EF4444" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
