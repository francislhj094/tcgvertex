import React from 'react';
import { Link } from 'react-router-dom';
import { IdentificationCard, TwitterLogo, DiscordLogo, YoutubeLogo } from 'phosphor-react';
import { useTranslation } from '../translations/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-warm)',
      marginTop: '0',
      padding: '60px 24px 24px',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'space-between',
          marginBottom: '60px'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <div className="logo flex-center" style={{
              gap: '12px',
              justifyContent: 'flex-start',
              marginBottom: '16px'
            }}>
              <IdentificationCard size={32} color="var(--accent-terracotta)" weight="duotone" />
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                letterSpacing: '-0.5px',
                fontFamily: 'var(--font-heading)'
              }}>
                <Link to="/" style={{ color: 'var(--text-primary)' }}>
                  PokéPrice <span className="text-accent">Tracker</span>
                </Link>
              </h2>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              maxWidth: '300px',
              lineHeight: 1.6
            }}>
              {t('footer.description')}
            </p>
            <div className="socials flex-center" style={{
              gap: '16px',
              justifyContent: 'flex-start'
            }}>
              <a
                href="#"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <TwitterLogo size={24} weight="fill" />
              </a>
              <a
                href="#"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <DiscordLogo size={24} weight="fill" />
              </a>
              <a
                href="#"
                style={{
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <YoutubeLogo size={24} weight="fill" />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 500 }}>{t('footer.platform')}</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                color: 'var(--text-secondary)'
              }}>
                <li>
                  <Link
                    to="/market"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.browseCards')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.watchlist')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sets"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.cardSets')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#pricing"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.pricing')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 500 }}>{t('footer.support')}</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                color: 'var(--text-secondary)'
              }}>
                <li>
                  <Link
                    to="/about"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.contact')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#affiliate"
                    style={{ transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {t('footer.affiliate')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-warm)'
        }}>
          &copy; {new Date().getFullYear()} PokéPrice Tracker. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
