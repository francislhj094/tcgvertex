import React, { useState, useEffect } from 'react';
import { Storefront, TrendDown, Trophy, Lightning, CheckCircle, ArrowRight } from 'phosphor-react';
import { getAllMarketplacePrices, getPriceComparison } from '../services/marketplace';
import { buildAffiliateLink } from '../services/api';

const MarketplaceComparison = ({ card, basePrice }) => {
  const [marketplaces, setMarketplaces] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketplaces = async () => {
      setLoading(true);

      // Simulate loading delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = await getAllMarketplacePrices(card, basePrice);
      setMarketplaces(data);

      const comparisonData = getPriceComparison(data);
      setComparison(comparisonData);

      setLoading(false);
    };

    loadMarketplaces();
  }, [card, basePrice]);

  if (loading) {
    return (
      <div className="glass-panel" style={{
        padding: '60px 40px',
        textAlign: 'center',
        border: '1.5px solid var(--border-warm)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid var(--border-warm)',
          borderTop: '3px solid var(--accent-terracotta)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Comparing prices across marketplaces...</p>
      </div>
    );
  }

  if (!marketplaces || !comparison) {
    return null;
  }

  const MarketplaceCard = ({ data, isBestDeal }) => {
    if (!data.available) {
      return (
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-warm)',
          opacity: 0.6
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-secondary)'
          }}>
            {data.sourceName}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Not Available
          </div>
        </div>
      );
    }

    const mainPrice = data.prices.market || data.prices.buyNow || data.prices.trend || data.prices.low || 0;
    const shippingCost = parseFloat(data.shipping);
    const totalPrice = mainPrice + shippingCost;

    return (
      <div className="glass-panel" style={{
        padding: '24px',
        background: isBestDeal
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--bg-white) 100%)'
          : 'var(--bg-white)',
        border: isBestDeal ? '2px solid var(--accent-green)' : '1.5px solid var(--border-warm)',
        position: 'relative',
        transition: 'all 0.3s'
      }}
      onMouseOver={e => {
        if (!isBestDeal) {
          e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={e => {
        if (!isBestDeal) {
          e.currentTarget.style.borderColor = 'var(--border-warm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      >
        {isBestDeal && (
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-green)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}>
            <Trophy size={16} weight="fill" />
            Best Deal
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {data.sourceName}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {data.condition}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '6px'
          }}>
            Price
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 500,
            color: isBestDeal ? 'var(--accent-green)' : 'var(--accent-terracotta)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            ${mainPrice.toFixed(2)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid var(--border-warm)',
          borderBottom: '1px solid var(--border-warm)',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Shipping
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>
            ${shippingCost.toFixed(2)}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>
            Total
          </span>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
          }}>
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Additional price info */}
        {data.source === 'tcgplayer' && data.prices.low && (
          <div style={{
            padding: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Low</span>
              <span>${data.prices.low.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>High</span>
              <span>${data.prices.high.toFixed(2)}</span>
            </div>
          </div>
        )}

        {data.source === 'ebay' && data.prices.auction && (
          <div style={{
            padding: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Auction Start</span>
              <span>${data.prices.auction.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avg Sold</span>
              <span>${data.prices.avgSold.toFixed(2)}</span>
            </div>
          </div>
        )}

        <a
          href={data.source === 'tcgplayer' ? buildAffiliateLink(data.url) : data.url}
          target="_blank"
          rel="noopener noreferrer"
          className={isBestDeal ? 'btn-primary' : 'btn-outline'}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '14px',
            fontSize: '0.95rem',
            background: isBestDeal ? 'var(--accent-green)' : undefined,
            borderColor: isBestDeal ? 'var(--accent-green)' : undefined
          }}
          onMouseOver={e => {
            if (isBestDeal) {
              e.currentTarget.style.background = 'var(--accent-green)';
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseOut={e => {
            if (isBestDeal) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          <Storefront size={20} weight="bold" />
          View on {data.sourceName}
        </a>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{
      padding: '32px',
      border: '1.5px solid var(--border-warm)',
      background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Storefront size={24} color="var(--accent-terracotta)" weight="fill" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Multi-Marketplace Comparison</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Find the best deal across {comparison.totalMarketplaces} marketplaces
        </p>
      </div>

      {/* Best Deal Banner */}
      {comparison.bestDeal && comparison.savings && comparison.savings.amount > 0 && (
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'var(--accent-green)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrendDown size={28} color="white" weight="fill" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: 'var(--accent-green)' }}>
              Save ${comparison.savings.amount} ({comparison.savings.percent}%)
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Best price found on <strong>{comparison.bestDeal.marketplace}</strong> vs other marketplaces
            </div>
          </div>
        </div>
      )}

      {/* Marketplace Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <MarketplaceCard
          data={marketplaces.tcgplayer}
          isBestDeal={comparison.bestDeal?.source === 'tcgplayer'}
        />
        <MarketplaceCard
          data={marketplaces.ebay}
          isBestDeal={comparison.bestDeal?.source === 'ebay'}
        />
        <MarketplaceCard
          data={marketplaces.cardmarket}
          isBestDeal={comparison.bestDeal?.source === 'cardmarket'}
        />
      </div>

      {/* Info Footer */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--accent-terracotta-tint)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(196, 97, 47, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Lightning size={18} color="var(--accent-terracotta)" weight="fill" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--accent-terracotta)' }}>
            Premium Feature
          </strong>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Prices update every 6 hours. We compare across multiple marketplaces to help you find the absolute best deal. Some links are affiliate links that support this site.
        </p>
      </div>
    </div>
  );
};

export default MarketplaceComparison;
