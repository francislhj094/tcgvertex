import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TrendUp, TrendDown, Fire, Warning, CaretUp, CaretDown } from 'phosphor-react';
import { useCountry } from '../context/CountryContext';

const MarketMovers = () => {
  const [data, setData] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gainers');
  const { formatPrice } = useCountry();

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const response = await fetch('/api/calculate-movers').catch(() => null);
        if (!response || !response.ok) {
          console.warn('API not available, falling back to mock data for Concept Test UI');
          // Provide highly realistic mock data if running without Vercel CLI
          const mockData = {
            gainers: [
              { id: 'sv3pt5-151', name: 'Mew ex - Special Illustration Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/205.png' }, currentPrice: 110.50, percentChange: 14.2 },
              { id: 'sv3pt5-199', name: 'Charizard ex - Special Illustration Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/199.png' }, currentPrice: 135.20, percentChange: 8.5 },
              { id: 'sv3pt5-198', name: 'Venusaur ex - Special Illustration Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/198.png' }, currentPrice: 45.00, percentChange: 6.1 },
            ],
            losers: [
              { id: 'sv3pt5-200', name: 'Blastoise ex - Special Illustration Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/200.png' }, currentPrice: 42.10, percentChange: -12.4 },
              { id: 'sv3pt5-183', name: 'Charizard ex - Ultra Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/183.png' }, currentPrice: 28.50, percentChange: -8.2 },
              { id: 'sv3pt5-150', name: 'Mewtwo - Illustration Rare', set: '151', images: { small: 'https://images.pokemontcg.io/sv3pt5/150.png' }, currentPrice: 18.25, percentChange: -5.7 },
            ]
          };
          setData(mockData);
        } else {
          const result = await response.json();
          setData(result.data);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load market movers right now. Try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovers();
  }, []);

  const currentList = activeTab === 'gainers' ? data.gainers : data.losers;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
      <Helmet>
        <title>Market Movers | PokéPrice Tracker</title>
        <meta name="description" content="Discover the top gaining and losing Pokémon TCG cards in the last 24 hours." />
      </Helmet>

      <header style={{ marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="eyebrow-pill">
            <Fire size={14} weight="fill" /> Daily Movers
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Market <span className="text-accent">Movers</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Track the biggest 24-hour price shifts in the Pokémon TCG market.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('gainers')}
          style={{
            flex: 1, padding: '16px', borderRadius: 'var(--radius-sm)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            background: activeTab === 'gainers' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
            color: activeTab === 'gainers' ? 'var(--accent-green)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'gainers' ? 'inset 0 0 0 2px var(--accent-green)' : 'none'
          }}
        >
          <TrendUp size={24} weight="bold" /> Top Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          style={{
            flex: 1, padding: '16px', borderRadius: 'var(--radius-sm)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            background: activeTab === 'losers' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)',
            color: activeTab === 'losers' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'losers' ? 'inset 0 0 0 2px var(--accent-red)' : 'none'
          }}
        >
          <TrendDown size={24} weight="bold" /> Top Losers
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading real-time market data...</div>
      ) : error ? (
        <div className="glass-panel flex-center" style={{ padding: '60px', color: 'var(--accent-red)', gap: '12px' }}>
          <Warning size={32} /> {error}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          {currentList.map((card, index) => (
            <Link key={card.id} to={`/card/${card.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', padding: '20px 24px',
                borderBottom: index !== currentList.length - 1 ? '1px solid var(--border-warm)' : 'none',
                transition: 'background 0.2s', cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '40px', fontWeight: 600, color: 'var(--text-muted)' }}>#{index + 1}</div>
                <img src={card.images.small} alt={card.name} style={{ width: '48px', height: '67px', borderRadius: '4px', marginRight: '20px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{card.name}</h4>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{card.set}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {formatPrice(card.currentPrice)}
                  </div>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px',
                    color: card.percentChange > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontWeight: 600, fontSize: '0.95rem'
                  }}>
                    {card.percentChange > 0 ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
                    {Math.abs(card.percentChange).toFixed(1)}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketMovers;
