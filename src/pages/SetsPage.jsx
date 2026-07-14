import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { GridFour, CalendarBlank, Cards } from 'phosphor-react';
import { fetchSets } from '../services/api';
import { useTranslation } from '../translations/useTranslation';

const SetsPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSets = async () => {
      setLoading(true);
      const data = await fetchSets();
      setSets(data);
      setLoading(false);
    };
    loadSets();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <Helmet>
        <title>Browse All Pokémon TCG Sets | PokéPrice Tracker</title>
        <meta name="description" content="Browse every Pokémon TCG expansion set. View card lists, prices, and market data for Scarlet & Violet, Sword & Shield, and more." />
      </Helmet>

      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '40px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
      }}>
        <img src="/sets-collection.png" alt="Pokémon Card Sets" style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(31,36,33,0.9) 0%, rgba(31,36,33,0.4) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GridFour size={36} color="var(--accent-terracotta)" />
            {t('sets.title')} <span style={{ color: 'var(--accent-terracotta)' }}>{t('sets.titleAccent')}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '500px' }}>
            {t('sets.subtitle')}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sets.map(set => (
            <Link to={`/sets/${set.id}`} key={set.id} className="glass-panel flex-center" style={{ padding: '20px', gap: '16px', justifyContent: 'flex-start', transition: 'all var(--transition-fast)', cursor: 'pointer', textDecoration: 'none' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
              <img src={set.images?.symbol} alt={set.name} style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{set.name}</h4>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span className="flex-center" style={{ gap: '4px' }}>
                    <CalendarBlank size={12} /> {set.releaseDate}
                  </span>
                  <span className="flex-center" style={{ gap: '4px' }}>
                    <Cards size={12} /> {set.total} cards
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.15)', padding: '4px 8px', borderRadius: '8px', fontWeight: '600', flexShrink: 0 }}>
                {set.series}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetsPage;
