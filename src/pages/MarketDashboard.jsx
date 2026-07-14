import React, { useState, useEffect } from 'react';
import CardDisplay from '../components/CardDisplay';
import CardSkeleton from '../components/CardSkeleton';
import { MagnifyingGlass, Funnel, Star, Coins, SlidersHorizontal, Lightning } from 'phosphor-react';
import { searchCards, buildAffiliateLink } from '../services/api';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';

const MarketDashboard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation();
  const { formatPrice } = useCountry();

  // Filter state
  const [filters, setFilters] = useState({
    rarity: {
      secretRare: true,
      ultraRare: true,
      rare: true,
      uncommon: true
    },
    priceMin: '',
    priceMax: ''
  });

  const loadCards = async (query) => {
    setLoading(true);
    const results = await searchCards(query);
    setCards(results);
    setLoading(false);
  };

  useEffect(() => {
    loadCards(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  };

  // Filter cards based on selected filters
  const filteredCards = cards.filter(card => {
    // Rarity filter
    const cardRarity = card.rarity?.toLowerCase().replace(/\s+/g, '') || '';

    // Map card rarities to filter keys
    let matchesRarity = false;
    if (cardRarity.includes('secret') && filters.rarity.secretRare) matchesRarity = true;
    else if (cardRarity.includes('ultra') || cardRarity.includes('hyper')) {
      matchesRarity = filters.rarity.ultraRare;
    }
    else if (cardRarity.includes('rare') && !cardRarity.includes('ultra')) {
      matchesRarity = filters.rarity.rare;
    }
    else if (cardRarity.includes('uncommon')) {
      matchesRarity = filters.rarity.uncommon;
    }
    else {
      // Default: show if any rarity filter is enabled
      matchesRarity = Object.values(filters.rarity).some(v => v);
    }

    if (!matchesRarity) return false;

    // Price filter
    const price = card.tcgplayer?.prices?.holofoil?.market ||
                  card.tcgplayer?.prices?.normal?.market ||
                  card.tcgplayer?.prices?.reverseHolofoil?.market || 0;

    if (filters.priceMin && price < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && price > parseFloat(filters.priceMax)) return false;

    return true;
  });

  const handleRarityChange = (rarityKey) => {
    setFilters({
      ...filters,
      rarity: {
        ...filters.rarity,
        [rarityKey]: !filters.rarity[rarityKey]
      }
    });
  };

  const handlePriceChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      rarity: {
        secretRare: true,
        ultraRare: true,
        rare: true,
        uncommon: true
      },
      priceMin: '',
      priceMax: ''
    });
  };

  return (
    <div className="container market-layout" style={{
      padding: '40px 24px',
      display: 'flex',
      gap: '48px',
      alignItems: 'flex-start'
    }}>
      {/* Premium Sidebar */}
      <aside className="market-sidebar" style={{
        width: '300px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          position: 'sticky',
          top: '100px',
          background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
          border: '1.5px solid var(--border-warm)'
        }}>
          <div className="flex-center" style={{
            justifyContent: 'flex-start',
            gap: '10px',
            paddingBottom: '20px',
            borderBottom: '1.5px solid var(--border-warm)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SlidersHorizontal size={22} color="var(--accent-terracotta)" weight="bold" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Filters</h3>
          </div>

          <div>
            <h4 className="flex-center" style={{
              justifyContent: 'flex-start',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Star size={18} weight="fill" color="var(--accent-terracotta)" /> Rarity
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label className="flex-center" style={{
                justifyContent: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <input
                  type="checkbox"
                  checked={filters.rarity.secretRare}
                  onChange={() => handleRarityChange('secretRare')}
                  style={{ accentColor: 'var(--accent-terracotta)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Secret Rare
              </label>

              <label className="flex-center" style={{
                justifyContent: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <input
                  type="checkbox"
                  checked={filters.rarity.ultraRare}
                  onChange={() => handleRarityChange('ultraRare')}
                  style={{ accentColor: 'var(--accent-terracotta)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Ultra Rare
              </label>

              <label className="flex-center" style={{
                justifyContent: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <input
                  type="checkbox"
                  checked={filters.rarity.rare}
                  onChange={() => handleRarityChange('rare')}
                  style={{ accentColor: 'var(--accent-terracotta)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Rare
              </label>

              <label className="flex-center" style={{
                justifyContent: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <input
                  type="checkbox"
                  checked={filters.rarity.uncommon}
                  onChange={() => handleRarityChange('uncommon')}
                  style={{ accentColor: 'var(--accent-terracotta)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Uncommon
              </label>
            </div>
          </div>

          <div>
            <h4 className="flex-center" style={{
              justifyContent: 'flex-start',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Coins size={18} weight="fill" color="var(--accent-terracotta)" /> Price Range
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="number"
                placeholder="Min $"
                value={filters.priceMin}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid var(--border-warm)',
                  background: 'var(--bg-white)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.priceMax}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid var(--border-warm)',
                  background: 'var(--bg-white)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            <SlidersHorizontal size={18} weight="bold" />
            Clear Filters
          </button>

          <div style={{
            padding: '16px',
            background: 'var(--accent-terracotta-tint)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(196, 97, 47, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lightning size={18} weight="fill" color="var(--accent-terracotta)" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-terracotta)' }}>Pro Tip</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Upgrade to Premium for instant price alerts on your favorite cards
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <header style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="eyebrow-pill">
                <Lightning size={14} weight="fill" /> {t('market.badge')}
              </span>
            </div>
            <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              {t('market.title')} <span className="text-accent">{t('market.titleAccent')}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              {filteredCards.length > 0 && filteredCards.length !== cards.length ? (
                <>Showing {filteredCards.length} of {cards.length} cards</>
              ) : (
                <>Track real-time prices across {cards.length > 0 ? `${cards.length.toLocaleString()}+` : 'thousands of'} cards from every set</>
              )}
            </p>
          </div>

          <div className="glass-panel flex-center market-search" style={{
            padding: '16px 24px',
            gap: '14px',
            borderRadius: 'var(--radius-pill)',
            maxWidth: '600px',
            border: '1.5px solid var(--border-warm)',
            background: 'var(--bg-white)',
            transition: 'all 0.3s'
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 97, 47, 0.15)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--border-warm)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          tabIndex="0">
            <MagnifyingGlass size={22} color="var(--accent-terracotta)" weight="bold" />
            <input
              type="text"
              placeholder={t('market.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                fontSize: '1.05rem',
                fontWeight: 400
              }}
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--border-warm)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              >
                Clear
              </button>
            )}
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredCards.length > 0 ? (
            filteredCards.map(card => {
              const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
              return (
                <CardDisplay
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  image={card.images?.large || card.images?.small}
                  price={price}
                  rarity={card.rarity || 'Promo'}
                  affiliateLink={buildAffiliateLink(card.tcgplayer?.url)}
                />
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '100px 20px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--bg-secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <MagnifyingGlass size={40} color="var(--text-muted)" />
              </div>
              <h3 style={{ marginBottom: '12px', fontWeight: 500, fontSize: '1.5rem' }}>{t('market.noResults')}</h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '20px' }}>
                {cards.length > 0 ? 'No cards match your filters. Try adjusting your selection.' : 'Try adjusting your search or filters'}
              </p>
              {cards.length > 0 && filteredCards.length === 0 && (
                <button
                  onClick={clearFilters}
                  className="btn-outline"
                  style={{ padding: '12px 24px' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
