import React, { useState } from 'react';
import { Globe } from 'phosphor-react';
import { useCountry, COUNTRIES } from '../context/CountryContext';

const CountrySelector = () => {
  const { country, switchCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);

  const handleCountryChange = (countryCode) => {
    switchCountry(countryCode);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-warm)',
          borderRadius: 'var(--radius-pill)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
          e.currentTarget.style.background = 'var(--bg-white)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border-warm)';
          e.currentTarget.style.background = 'var(--bg-secondary)';
        }}
      >
        <Globe size={18} weight="bold" />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{country.code}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
          />

          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: '220px',
              background: 'var(--bg-white)',
              border: '1.5px solid var(--border-warm)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 24px rgba(31, 36, 33, 0.12)',
              padding: '8px',
              zIndex: 999,
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>

            {Object.values(COUNTRIES).map((c) => (
              <button
                key={c.code}
                onClick={() => handleCountryChange(c.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px 14px',
                  background: country.code === c.code ? 'var(--accent-terracotta-tint)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.95rem',
                  fontWeight: country.code === c.code ? 600 : 500,
                  color: country.code === c.code ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                  textAlign: 'left'
                }}
                onMouseOver={e => {
                  if (country.code !== c.code) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseOut={e => {
                  if (country.code !== c.code) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{c.flag}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px'
                    }}>
                      {c.currency} ({c.currencySymbol})
                    </div>
                  </div>
                </div>
                {country.code === c.code && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--accent-terracotta)',
                    borderRadius: '50%'
                  }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountrySelector;
