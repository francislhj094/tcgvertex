import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import CardDisplay from '../components/CardDisplay';
import CardSkeleton from '../components/CardSkeleton';
import { fetchCardsBySet, buildAffiliateLink } from '../services/api';
import { useTranslation } from '../translations/useTranslation';

const SetDetailPage = () => {
  const { setId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setInfo, setSetInfo] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const data = await fetchCardsBySet(setId);
      setCards(data);
      if (data.length > 0) {
        setSetInfo(data[0].set);
      }
      setLoading(false);
    };
    loadCards();
  }, [setId]);

  const setName = setInfo?.name || setId;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <Helmet>
        <title>{`${setName} — Cards List & Prices | PokéPrice Tracker`}</title>
        <meta name="description" content={`Browse all cards in the ${setName} Pokémon TCG set. View real-time prices and market data.`} />
      </Helmet>

      <Link to="/sets" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', transition: 'color 0.2s' }}
        onMouseOver={e => e.currentTarget.style.color = 'white'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
        <ArrowLeft weight="bold" /> {t('setDetail.backToSets')}
      </Link>

      <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {setInfo?.images?.logo && (
          <img src={setInfo.images.logo} alt={setName} style={{ height: '60px', objectFit: 'contain' }} />
        )}
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{setName}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {setInfo?.series} &bull; {t('setDetail.released')} {setInfo?.releaseDate} &bull; {setInfo?.total} {t('setDetail.cards')}
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          cards.map(card => {
            const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
            return (
              <CardDisplay
                key={card.id}
                id={card.id}
                name={card.name}
                image={card.images?.large || card.images?.small}
                price={price}
                rarity={card.rarity || 'Common'}
                affiliateLink={buildAffiliateLink(card.tcgplayer?.url)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SetDetailPage;
