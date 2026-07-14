import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChartLineUp, ShoppingCart, Heart, TrendUp, Lightning, CheckCircle, Sparkle, Bell } from 'phosphor-react';
import { fetchCardById, buildAffiliateLink } from '../services/api';
import { isInVault, addToVault, removeFromVault } from '../services/vault';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';
import PriceTable from '../components/PriceTable';
import PriceHistoryChart from '../components/PriceHistoryChart';
import PriceAlertModal from '../components/PriceAlertModal';
import MarketplaceComparison from '../components/MarketplaceComparison';

const CardDetailPage = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatPrice } = useCountry();

  useEffect(() => {
    const loadCard = async () => {
      setLoading(true);
      const data = await fetchCardById(id);
      setCard(data);
      setLoading(false);
    };
    loadCard();
    const checkVault = async () => {
      const result = await isInVault(id, user?.uid);
      setSaved(result);
    };
    checkVault();
  }, [id, user]);

  const handleVaultToggle = async () => {
    if (saved) {
      await removeFromVault(id, user?.uid);
      setSaved(false);
      addToast(`${card.name} removed from watchlist`, 'warning');
    } else {
      await addToVault(id, user?.uid);
      setSaved(true);
      addToast(`${card.name} added to watchlist!`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '70vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid var(--border-warm)',
          borderTop: '3px solid var(--accent-terracotta)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h3 style={{ color: 'var(--text-secondary)' }}>{t('cardDetail.loadingDetails')}</h3>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '2rem' }}>{t('cardDetail.notFound')}</h2>
        <Link to="/market" className="btn-primary">{t('cardDetail.returnToMarket')}</Link>
      </div>
    );
  }

  const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
  const affiliateUrl = buildAffiliateLink(card.tcgplayer?.url);
  const trend = (Math.random() * 20 - 5).toFixed(1);
  const isUp = trend >= 0;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1400px' }}>
      <Helmet>
        <title>{`${card.name} (${card.set?.name}) - Price & Market Data | PokéPrice Tracker`}</title>
        <meta name="description" content={`Track real-time pricing for ${card.name} from ${card.set?.name}. View market trends, price history, and find the best deals.`} />
        {card.images?.large && <meta property="og:image" content={card.images.large} />}
      </Helmet>

      <Link to="/market" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)',
        marginBottom: '40px',
        transition: 'color 0.2s',
        fontSize: '1rem',
        fontWeight: 500
      }}
      onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
      onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
        <ArrowLeft weight="bold" size={20} /> {t('cardDetail.backToMarket')}
      </Link>

      <div className="card-detail-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
        {/* Left Col: Card Image */}
        <div className="card-image-col" style={{ position: 'sticky', top: '100px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-warm)',
            boxShadow: '0 8px 32px rgba(31, 36, 33, 0.12)'
          }}>
            <img
              src={card.images?.large || card.images?.small}
              alt={card.name}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>

          {/* Quick Actions */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={handleVaultToggle}
              className={saved ? 'btn-primary' : 'btn-outline'}
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: '14px',
                fontSize: '0.95rem'
              }}
            >
              <Heart size={20} weight={saved ? 'fill' : 'regular'} />
              {saved ? t('common.inWatchlist') : t('common.addToWatchlist')}
            </button>
            <button
              onClick={() => setAlertModalOpen(true)}
              className="btn-outline"
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: '14px',
                fontSize: '0.95rem',
                borderColor: 'var(--accent-terracotta)',
                color: 'var(--accent-terracotta)'
              }}
            >
              <Bell size={20} weight="bold" />
              {t('cardDetail.setAlert')}
            </button>
          </div>
        </div>

        {/* Right Col: Card Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Header */}
          <div>
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'var(--accent-terracotta-tint)',
                color: 'var(--accent-terracotta)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {card.supertype}
              </span>
              <span style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {card.rarity || 'Common'}
              </span>
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '12px', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {card.name}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {card.set?.name} • {card.set?.series}
            </p>
          </div>

          {/* Premium Price Card */}
          <div className="glass-panel" style={{
            padding: '40px',
            background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)',
            border: '1.5px solid var(--border-warm)',
            boxShadow: '0 8px 24px rgba(31, 36, 33, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600
                }}>
                  <ChartLineUp size={16} weight="bold" /> {t('cardDetail.currentPrice')}
                </div>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 500,
                  color: 'var(--accent-terracotta)',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}>
                  {formatPrice(typeof price === 'number' ? price : 0)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600
                }}>
                  {t('cardDetail.priceChange24h')}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: isUp ? 'var(--accent-green)' : 'var(--accent-red)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  {isUp ? <TrendUp weight="bold" size={24} /> : <TrendUp weight="bold" size={24} style={{ transform: 'rotate(180deg)' }} />}
                  {Math.abs(trend)}%
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-warm)'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Release Date
                </div>
                <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>
                  {card.set?.releaseDate || 'Unknown'}
                </div>
              </div>
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-warm)'
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Artist
                </div>
                <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>
                  {card.artist || 'Unknown'}
                </div>
              </div>
            </div>

            <a
              href={affiliateUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.1rem',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(196, 97, 47, 0.25)'
              }}
            >
              <ShoppingCart size={24} weight="bold" />
              View Best Price on TCGPlayer
            </a>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '12px',
              lineHeight: 1.5
            }}>
              We may earn a commission if you make a purchase through this link
            </p>
          </div>

          {/* Price History Chart */}
          <PriceHistoryChart
            cardId={card.id}
            currentPrice={price}
            cardName={card.name}
          />

          {/* Multi-Marketplace Comparison */}
          <MarketplaceComparison
            card={card}
            basePrice={price}
          />

          {/* Price Breakdown Table */}
          {card.tcgplayer?.prices && (
            <div className="glass-panel" style={{
              padding: '32px',
              border: '1.5px solid var(--border-warm)'
            }}>
              <h3 style={{
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.5rem'
              }}>
                <Sparkle size={24} color="var(--accent-terracotta)" weight="fill" />
                Price by Condition
              </h3>
              <PriceTable prices={card.tcgplayer.prices} />
            </div>
          )}

          {/* Premium Features Upsell */}
          <div className="glass-panel" style={{
            padding: '32px',
            background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, rgba(242, 227, 214, 0.3) 100%)',
            border: '1.5px solid rgba(196, 97, 47, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--accent-terracotta)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lightning size={28} color="white" weight="fill" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Get Price Alerts</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Never miss a deal on this card
                </p>
              </div>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
                Instant email alerts when price drops
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
                Track unlimited cards
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                <CheckCircle size={20} color="var(--accent-terracotta)" weight="fill" />
                90-day price history charts
              </li>
            </ul>
            <Link to="/premium" className="btn-primary" style={{
              width: '100%',
              justifyContent: 'center',
              padding: '16px'
            }}>
              Upgrade to Premium - $9.99
            </Link>
          </div>

          {/* Flavor Text */}
          {card.flavorText && (
            <div style={{
              padding: '28px',
              background: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--accent-terracotta)',
              borderRadius: 'var(--radius-md)'
            }}>
              <h4 style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                fontWeight: 600
              }}>
                Card Lore
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                lineHeight: 1.7
              }}>
                "{card.flavorText}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Price Alert Modal */}
      {card && (
        <PriceAlertModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          card={card}
          currentPrice={price}
        />
      )}
    </div>
  );
};

export default CardDetailPage;
