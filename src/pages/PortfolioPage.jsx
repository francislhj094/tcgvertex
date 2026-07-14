import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash, TrendUp, TrendDown, ArrowRight, Lightning, Sparkle, ShoppingCart, ChartLine } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { getVault, removeFromVault } from '../services/vault';
import { fetchCardsByIds, buildAffiliateLink } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';
import CardSkeleton from '../components/CardSkeleton';
import PortfolioValueChart from '../components/PortfolioValueChart';
import PerformanceCards from '../components/PerformanceCards';

const PortfolioPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatPrice } = useCountry();

  const loadPortfolio = async () => {
    setLoading(true);
    const ids = await getVault(user?.uid);
    if (ids.length === 0) {
      setCards([]);
      setLoading(false);
      return;
    }
    const data = await fetchCardsByIds(ids);
    setCards(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolio();
  }, [user]);

  const handleRemove = async (card) => {
    await removeFromVault(card.id, user?.uid);
    setCards(prev => prev.filter(c => c.id !== card.id));
    addToast(`${card.name} removed from watchlist`, 'warning');
  };

  const totalValue = cards.reduce((sum, card) => {
    const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
    return sum + price;
  }, 0);

  const freeLimit = 10;
  const isAtLimit = cards.length >= freeLimit;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1400px' }}>
      <Helmet>
        <title>My Watchlist | PokéPrice Tracker</title>
        <meta name="description" content="Track your favorite Pokémon TCG cards and monitor their prices in real-time." />
      </Helmet>

      {/* Header */}
      <header style={{ marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="eyebrow-pill">
            <Heart size={14} weight="fill" /> {t('portfolio.badge')}
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {t('portfolio.title')} <span className="text-accent">{t('portfolio.titleAccent')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          {t('portfolio.subtitle')}
        </p>
      </header>

      {/* Premium Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <div className="glass-panel" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
          border: '1.5px solid var(--border-warm)'
        }}>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            {t('portfolio.cardsTracked')}
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 500,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)'
          }}>
            {cards.length}
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              /{freeLimit}
            </span>
          </div>
          {isAtLimit && (
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-terracotta)', marginTop: '8px', fontWeight: 500 }}>
              Upgrade for unlimited tracking
            </p>
          )}
        </div>

        <div className="glass-panel" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-white) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            <TrendUp size={16} weight="bold" color="var(--accent-green)" />
            {t('portfolio.totalValue')}
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 500,
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent-green)'
          }}>
            {formatPrice(totalValue)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {t('portfolio.currentMarketValue')}
          </p>
        </div>

        <div className="glass-panel" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, var(--bg-white) 100%)',
          border: '1.5px solid rgba(196, 97, 47, 0.2)'
        }}>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            {t('portfolio.avgCardValue')}
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 500,
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent-terracotta)'
          }}>
            {cards.length > 0 ? formatPrice(totalValue / cards.length) : formatPrice(0)}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {t('portfolio.perCardAverage')}
          </p>
        </div>
      </div>

      {/* Portfolio Analytics - Premium Feature */}
      {cards.length > 0 && (
        <>
          {/* Portfolio Value Chart */}
          <div style={{ marginBottom: '48px' }}>
            <PortfolioValueChart cards={cards} />
          </div>

          {/* Performance Cards */}
          <div style={{ marginBottom: '48px' }}>
            <PerformanceCards cards={cards} days={30} />
          </div>
        </>
      )}

      {/* Premium Upgrade Banner */}
      {isAtLimit && (
        <div className="glass-panel" style={{
          padding: '32px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, rgba(242, 227, 214, 0.3) 100%)',
          border: '1.5px solid rgba(196, 97, 47, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--accent-terracotta)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Lightning size={32} color="white" weight="fill" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
                {t('portfolio.limitReached')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {t('portfolio.upgradeMessage')}
              </p>
            </div>
          </div>
          <Link to="/premium" className="btn-primary" style={{ padding: '16px 32px', flexShrink: 0 }}>
            {t('portfolio.upgradeNow')}
          </Link>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="glass-panel flex-center" style={{
          flexDirection: 'column',
          gap: '32px',
          padding: '100px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
          border: '1.5px solid var(--border-warm)'
        }}>
          <div style={{
            maxWidth: '240px',
            margin: '0 auto',
            marginBottom: '16px'
          }}>
            <img src="/empty-watchlist.png" alt="Empty Watchlist" style={{ width: '100%', height: 'auto', mixBlendMode: 'multiply' }} />
          </div>
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.75rem' }}>{t('portfolio.emptyTitle')}</h3>
            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}>
              {t('portfolio.emptyMessage')}
              Get instant alerts when prices drop.
            </p>
          </div>
          <Link to="/market" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            Explore Market <ArrowRight weight="bold" />
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {cards.map(card => {
            const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;

            return (
              <div key={card.id} className="glass-panel" style={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.3s',
                border: '1.5px solid var(--border-warm)'
              }}>
                <Link to={`/card/${card.id}`}>
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                    padding: '16px'
                  }}>
                    <img
                      src={card.images?.large || card.images?.small}
                      alt={card.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.5s',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {card.rarity && (
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
                        {card.rarity}
                      </span>
                    )}
                  </div>
                </Link>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    minHeight: '2.6em'
                  }}>
                    {card.name}
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
                        Current Price
                      </div>
                      <span style={{
                        fontSize: '1.75rem',
                        fontWeight: 500,
                        color: 'var(--accent-terracotta)',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '-0.02em'
                      }}>
                        ${price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-between" style={{ gap: '10px', marginTop: '4px' }}>
                    <a
                      href={buildAffiliateLink(card.tcgplayer?.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-center"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '12px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <ShoppingCart size={16} weight="bold" />
                      Buy
                    </a>
                    <button
                      onClick={() => handleRemove(card)}
                      className="btn-outline flex-center"
                      style={{
                        padding: '12px 16px',
                        color: 'var(--accent-red)',
                        borderColor: 'rgba(239,68,68,0.3)'
                      }}
                      title="Remove from watchlist"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
