import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendUp, TrendDown, Trophy, ArrowDown } from 'phosphor-react';
import { calculateRealPortfolioMetrics } from '../services/firestoreHistory';

const PerformanceCards = ({ cards, days = 30 }) => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [bottomPerformers, setBottomPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadPerformance = async () => {
      if (!cards || cards.length === 0) return;
      setLoading(true);
      try {
        const metrics = await calculateRealPortfolioMetrics(cards, days);
        if (isMounted) {
          const sorted = [...metrics.performances];
          
          // Top performers (descending by gainPercent)
          const top = [...sorted].sort((a, b) => b.gainPercent - a.gainPercent).slice(0, 3);
          // Bottom performers (ascending by gainPercent)
          const bottom = [...sorted].sort((a, b) => a.gainPercent - b.gainPercent).slice(0, 3);
          
          setTopPerformers(top);
          setBottomPerformers(bottom);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading card performance:', error);
        if (isMounted) setLoading(false);
      }
    };
    
    loadPerformance();
    return () => {
      isMounted = false;
    };
  }, [cards, days]);

  if (!cards || cards.length === 0) return null;
  
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="skeleton" style={{ height: '240px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '240px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const PerformerCard = ({ performer, rank, isTop }) => (
    <Link
      to={`/card/${performer.cardId}`}
      style={{
        textDecoration: 'none',
        display: 'block'
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'var(--bg-white)',
          border: '1.5px solid var(--border-warm)',
          transition: 'all 0.3s',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(196, 97, 47, 0.15)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border-warm)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Rank Badge */}
        {rank === 1 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            background: isTop ? 'var(--accent-terracotta)' : 'var(--text-muted)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}>
            {isTop ? <Trophy size={18} color="white" weight="fill" /> : <ArrowDown size={18} color="white" weight="fill" />}
          </div>
        )}

        {/* Card Image */}
        <img
          src={performer.cardImage}
          alt={performer.cardName}
          style={{
            width: '70px',
            height: 'auto',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />

        {/* Card Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {performer.cardName}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ${performer.currentPrice.toFixed(2)}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              background: performer.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: performer.isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {performer.isPositive ? <TrendUp weight="bold" size={14} /> : <TrendDown weight="bold" size={14} />}
              {performer.isPositive ? '+' : ''}{performer.gainPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Gain Amount */}
        <div style={{
          textAlign: 'right',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: performer.isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
          fontFamily: 'var(--font-heading)'
        }}>
          {performer.isPositive ? '+' : ''}${Math.abs(performer.gain).toFixed(2)}
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '32px'
    }}>
      {/* Top Performers */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <TrendUp size={24} color="var(--accent-green)" weight="bold" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', fontWeight: 500 }}>
              Top Performers
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Best gains in last {days} days
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topPerformers.map((performer, index) => (
            <PerformerCard
              key={performer.cardId}
              performer={performer}
              rank={index + 1}
              isTop={true}
            />
          ))}
        </div>
      </div>

      {/* Bottom Performers */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <TrendDown size={24} color="var(--accent-red)" weight="bold" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', fontWeight: 500 }}>
              Worst Performers
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Biggest drops in last {days} days
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bottomPerformers.map((performer, index) => (
            <PerformerCard
              key={performer.cardId}
              performer={performer}
              rank={index + 1}
              isTop={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceCards;
