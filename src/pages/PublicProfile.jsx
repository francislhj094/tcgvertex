import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPublicVaultByUsername } from '../services/vault';
import { fetchCardsByIds, buildAffiliateLink } from '../services/api';
import { useCountry } from '../context/CountryContext';
import { Heart, Sparkle, TrendUp, IdentificationCard, ShieldCheck } from 'phosphor-react';
import CardSkeleton from '../components/CardSkeleton';

const PublicProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useCountry();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const data = await getPublicVaultByUsername(username);
      if (!data) {
        setError('Profile not found or is private.');
        setLoading(false);
        return;
      }
      setUserData(data);
      if (data.vault && data.vault.length > 0) {
        const fetchedCards = await fetchCardsByIds(data.vault);
        setCards(fetchedCards);
      }
      setLoading(false);
    };
    loadProfile();
  }, [username]);

  const totalValue = cards.reduce((sum, card) => {
    const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
    return sum + price;
  }, 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center', maxWidth: '600px' }}>
        <IdentificationCard size={64} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
        <h2 style={{ marginBottom: '16px' }}>{error}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          This user might not exist, or they haven't made their portfolio public.
        </p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1400px' }}>
      <Helmet>
        <title>{username}'s Collection | PokéPrice Tracker</title>
        <meta name="description" content={`Check out ${username}'s Pokémon TCG collection on PokéPrice Tracker.`} />
        <meta property="og:title" content={`${username}'s Pokémon TCG Collection`} />
        <meta property="og:description" content={`Total Value: ${formatPrice(totalValue)} across ${cards.length} cards.`} />
      </Helmet>

      {/* Header Profile */}
      <div className="glass-panel" style={{ 
        padding: '48px', 
        marginBottom: '48px', 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-white) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          background: 'radial-gradient(circle, var(--accent-terracotta-tint) 0%, transparent 60%)',
          opacity: 0.3, pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '96px', height: '96px', borderRadius: '50%', background: 'var(--accent-terracotta)', 
            margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '2.5rem', fontWeight: 600, boxShadow: '0 8px 32px rgba(196, 97, 47, 0.3)'
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>@{username}</h1>
            {userData.isPremium && <ShieldCheck size={28} weight="fill" color="var(--accent-green)" title="Verified Premium Member" />}
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '32px' }}>
            Public Pokémon TCG Collection
          </p>

          <div style={{ display: 'inline-flex', gap: '32px', background: 'var(--bg-white)', padding: '24px 48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-warm)' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Cards</div>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cards.length}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-warm)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                <TrendUp size={16} color="var(--accent-green)" /> Value
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-green)' }}>{formatPrice(totalValue)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        {cards.map(card => {
          const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
          return (
            <div key={card.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-warm)' }}>
              <Link to={`/card/${card.id}`}>
                <div style={{ background: 'var(--bg-secondary)', padding: '24px', display: 'flex', justifyContent: 'center' }}>
                  <img src={card.images?.small} alt={card.name} style={{ height: '260px', width: 'auto', borderRadius: '4px' }} />
                </div>
              </Link>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{card.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{card.set?.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-terracotta)' }}>{formatPrice(price)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action for visitors */}
      <div className="glass-panel" style={{ marginTop: '64px', padding: '48px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <Sparkle size={40} color="var(--accent-terracotta)" weight="fill" style={{ marginBottom: '16px' }} />
        <h2 style={{ marginBottom: '16px' }}>Build your own collection</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Start tracking your Pokémon TCG cards, get real-time price alerts, and create your own public profile.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Get Started for Free</Link>
      </div>

    </div>
  );
};

export default PublicProfile;
