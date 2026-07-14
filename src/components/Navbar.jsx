import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChartLineUp, IdentificationCard, List, X, GridFour, Wallet, SignOut, UserCircle, Code, Fire } from 'phosphor-react';
import AuthModal from './AuthModal';
import UpgradeModal from './UpgradeModal';
import CountrySelector from './CountrySelector';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../translations/useTranslation';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    gap: '8px',
    transition: 'color 0.2s',
    fontWeight: 500,
    color: isActive(path) ? 'var(--accent-terracotta)' : 'var(--text-secondary)',
  });

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      addToast('Logged out successfully', 'info');
    } catch {
      addToast('Error logging out', 'warning');
    }
  };

  return (
    <>
      <nav className="glass-panel" style={{
        padding: '16px 24px',
        position: 'sticky',
        top: '0',
        zIndex: 100,
        margin: '16px auto',
        width: 'calc(100% - 48px)',
        maxWidth: '1200px',
        boxSizing: 'border-box',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.9)',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: '0'
      }}>
        <div className="flex-between">
          <div className="logo flex-center" style={{ gap: '12px' }}>
            <IdentificationCard size={32} color="var(--accent-terracotta)" weight="duotone" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px', fontFamily: 'var(--font-heading)' }}>
              <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>
                PokéPrice <span className="text-accent">Tracker</span>
              </Link>
            </h2>
          </div>

          <div className="nav-links flex-center" style={{ gap: '24px', fontWeight: 500, flexShrink: 0 }}>
            <Link to="/market" className="flex-center" style={linkStyle('/market')}>
              <ChartLineUp size={20} /> {t('nav.market')}
            </Link>
            <Link to="/movers" className="flex-center" style={linkStyle('/movers')}>
              <Fire size={20} /> Movers
            </Link>
            <Link to="/sets" className="flex-center" style={linkStyle('/sets')}>
              <GridFour size={20} /> Sets
            </Link>
            <Link to="/portfolio" className="flex-center" style={linkStyle('/portfolio')}>
              <Wallet size={20} /> {t('nav.portfolio')}
            </Link>
            <Link to="/developer" className="flex-center" style={linkStyle('/developer')}>
              <Code size={20} /> API
            </Link>
          </div>

          <div className="nav-actions flex-center" style={{ gap: '12px', flexShrink: 0 }}>
            <CountrySelector />
            {user ? (
              <UserDropdown />
            ) : (
              <button className="btn-outline" style={{ padding: '8px 16px', whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => setAuthModalOpen(true)}>
                {t('nav.login')}
              </button>
            )}
            <Link to="/premium" className="btn-primary" style={{ padding: '8px 16px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t('nav.premium')}
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
            <List size={28} weight="bold" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-nav-content ${menuOpen ? 'open' : ''}`}>
        <div className="flex-between" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-warm)' }}>
          <h3 className="text-accent" style={{ margin: 0 }}>Menu</h3>
          <button onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={24} weight="bold" />
          </button>
        </div>

        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', marginBottom: '8px',
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
          }}>
            <UserCircle size={28} weight="fill" color="var(--accent-terracotta)" />
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}

        <Link to="/market" onClick={() => setMenuOpen(false)}>
          <ChartLineUp size={20} /> {t('nav.market')}
        </Link>
        <Link to="/movers" onClick={() => setMenuOpen(false)}>
          <Fire size={20} /> Movers
        </Link>
        <Link to="/sets" onClick={() => setMenuOpen(false)}>
          <GridFour size={20} /> Sets
        </Link>
        <Link to="/portfolio" onClick={() => setMenuOpen(false)}>
          <Wallet size={20} /> {t('nav.portfolio')}
        </Link>
        <Link to="/developer" onClick={() => setMenuOpen(false)}>
          <Code size={20} /> Developer API
        </Link>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-warm)' }}>
          {user ? (
            <button className="btn-outline" style={{ justifyContent: 'center' }} onClick={handleLogout}>
              <SignOut size={16} weight="bold" /> {t('nav.logout')}
            </button>
          ) : (
            <button className="btn-outline" style={{ justifyContent: 'center' }} onClick={() => { setMenuOpen(false); setAuthModalOpen(true); }}>
              {t('nav.login')}
            </button>
          )}
          <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => { setMenuOpen(false); setUpgradeModalOpen(true); }}>
            {t('nav.premium')}
          </button>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </>
  );
};

export default Navbar;
