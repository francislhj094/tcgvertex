import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Bell, Sparkle, Shield, Star, MagnifyingGlass, Spinner, Trash } from 'phosphor-react';
import AuthModal from '../components/AuthModal';
import { useTranslation } from '../translations/useTranslation';
import { useCountry } from '../context/CountryContext';
import { searchCards } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createAlert } from '../services/firestoreAlerts';

const LPChecklist = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { t } = useTranslation();
  const { country, formatPrice } = useCountry();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Search & Alert simulator state
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [creatingAlert, setCreatingAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Localized Testimonials data mapping
  const testimonialsData = {
    US: [
      { name: 'Marcus L.', loc: 'Dallas, TX', text: "Caught a Charizard VMAX drop at 3 AM. Would have completely missed it without the tracker. Saved $40 on that one card alone.", stars: 5 },
      { name: 'Emily R.', loc: 'Boston, MA', text: "I used to waste 30 minutes every night checking prices. Now I just glance at my dashboard. It's genuinely changed how I collect.", stars: 5 },
      { name: 'Tom W.', loc: 'Orlando, FL', text: "The price history charts helped me realize my Moonbreon was trending down, so I sold at the right time. Data is everything.", stars: 5 }
    ],
    GB: [
      { name: 'Marcus L.', loc: 'Manchester, UK', text: "Caught a Charizard VMAX drop at 3 AM. Would have completely missed it without the tracker. Saved £35 on that one card alone.", stars: 5 },
      { name: 'Emily R.', loc: 'Bristol, UK', text: "I used to waste 30 minutes every night checking prices. Now I just glance at my dashboard. It's genuinely changed how I collect.", stars: 5 },
      { name: 'Tom W.', loc: 'London, UK', text: "The price history charts helped me realize my Moonbreon was trending down, so I sold at the right time. Data is everything.", stars: 5 }
    ],
    AU: [
      { name: 'Marcus L.', loc: 'Perth, AU', text: "Caught a Charizard VMAX drop at 3 AM. Would have completely missed it without the tracker. Saved A$55 on that one card alone.", stars: 5 },
      { name: 'Emily R.', loc: 'Adelaide, AU', text: "I used to waste 30 minutes every night checking prices. Now I just glance at my dashboard. It's genuinely changed how I collect.", stars: 5 },
      { name: 'Tom W.', loc: 'Gold Coast, AU', text: "The price history charts helped me realize my Moonbreon was trending down, so I sold at the right time. Data is everything.", stars: 5 }
    ],
    FR: [
      { name: 'Marc L.', loc: 'Paris, FR', text: "J'ai repéré une baisse de prix sur un Dracaufeu à 3 heures du matin. J'aurais tout raté sans le tracker. Économisé 40 € sur cette seule carte.", stars: 5 },
      { name: 'Emilie R.', loc: 'Lyon, FR', text: "Je perdais 30 minutes chaque soir à vérifier les prix. Maintenant, je regarde simplement mon tableau de bord. Ça a changé ma façon de collectionner.", stars: 5 },
      { name: 'Thomas W.', loc: 'Marseille, FR', text: "Les graphiques d'historique de prix m'ont aidé à voir que mon Noctali baissait, donc j'ai vendu au bon moment. Les données font tout.", stars: 5 }
    ],
    DE: [
      { name: 'Marcus L.', loc: 'München, DE', text: "Habe um 3 Uhr nachts einen Preissturz bei Glurak entdeckt. Ohne den Tracker hätte ich das komplett verpasst. 40 € gespart bei einer einzigen Karte.", stars: 5 },
      { name: 'Emily R.', loc: 'Hamburg, DE', text: "Früher habe ich jeden Abend 30 Minuten lang die Preise kontrolliert. Jetzt werfe ich nur noch einen Blick aufs Dashboard. Genial.", stars: 5 },
      { name: 'Thomas W.', loc: 'Berlin, DE', text: "Die Preishistorien-Charts haben mir gezeigt, dass meine Nachtara-Karte an Wert verliert, sodass ich zum optimalen Zeitpunkt verkaufen konnte.", stars: 5 }
    ]
  };

  // Default to US if country code is not mapped in testimonialsData
  const activeTestimonials = testimonialsData[country.code] || testimonialsData.US;

  // Handle card search typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchCards(searchQuery);
        // Take up to 6 results for the checklist widget
        setSearchResults(results.slice(0, 6));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  // Select card handler
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);

    // Estimate a target price of 10% below market price
    let marketPrice = 0;
    if (card.tcgplayer && card.tcgplayer.prices) {
      const prices = card.tcgplayer.prices;
      const key = prices.holofoil ? 'holofoil' : prices.normal ? 'normal' : Object.keys(prices)[0];
      if (key && prices[key]) {
        marketPrice = prices[key].market || prices[key].mid || 0;
      }
    }

    if (marketPrice > 0) {
      const discounted = (marketPrice * 0.9).toFixed(2);
      setTargetPrice(discounted);
    } else {
      setTargetPrice('10.00'); // fallback default
    }
  };

  // Remove selected card
  const handleClearCard = () => {
    setSelectedCard(null);
    setTargetPrice('');
  };

  // Helper to format prices inside the simulator
  const getCardPrice = (card) => {
    if (!card.tcgplayer || !card.tcgplayer.prices) return 0;
    const prices = card.tcgplayer.prices;
    const key = prices.holofoil ? 'holofoil' : prices.normal ? 'normal' : Object.keys(prices)[0];
    return prices[key]?.market || prices[key]?.mid || 0;
  };

  // Create alert inside Firestore and redirect
  const triggerCreateAlert = async (uid) => {
    if (!selectedCard) return;
    setCreatingAlert(true);
    try {
      const currentPrice = getCardPrice(selectedCard);
      const alertPayload = {
        cardId: selectedCard.id,
        cardName: selectedCard.name,
        cardImage: selectedCard.images.small,
        setName: selectedCard.setName || '',
        rarity: selectedCard.rarity || '',
        currentPrice: parseFloat(currentPrice),
        targetPrice: parseFloat(targetPrice),
        condition: 'below',
        alertType: 'email',
        frequency: 'instant'
      };
      
      await createAlert(alertPayload, uid);
      addToast(`Alert successfully set for ${selectedCard.name}!`, 'success');
      window.location.href = '/alerts';
    } catch (err) {
      console.error('Error setting alert:', err);
      if (err.message === 'ALERT_EXISTS') {
        addToast(`You already have a price alert for this card.`, 'warning');
        window.location.href = '/alerts';
      } else {
        addToast('Failed to create alert. Please try again.', 'error');
      }
    } finally {
      setCreatingAlert(false);
    }
  };

  // CTA Click handler
  const handleCtaClick = async () => {
    if (user) {
      if (selectedCard) {
        await triggerCreateAlert(user.uid);
      } else {
        window.location.href = '/market';
      }
    } else {
      setPendingAction(true);
      setAuthOpen(true);
    }
  };

  // Watch for auth changes to execute pending triggers or redirect returning users
  useEffect(() => {
    if (user && pendingAction) {
      setPendingAction(false);
      if (selectedCard) {
        triggerCreateAlert(user.uid);
      } else {
        window.location.href = '/market';
      }
    }
  }, [user, pendingAction]);

  return (
    <>
      <Helmet>
        <title>Stop Checking Prices Manually | PokéPrice Tracker Alerts</title>
        <meta name="description" content="Stop manually refreshing TCGplayer and eBay. Set real-time automated price alerts for your Pokémon cards instantly." />
      </Helmet>

      {/* Styled Keyframes & Custom Styles */}
      <style>{`
        /* Notepad Background & Elements */
        .notepad-container {
          background-color: #FAF8F5;
          position: relative;
          border-radius: 12px;
          border: 1px solid rgba(220, 215, 205, 0.7);
          box-shadow: 
            0 1px 3px rgba(0,0,0,0.05),
            0 10px 40px -10px rgba(60, 55, 45, 0.12),
            0 20px 60px -20px rgba(60, 55, 45, 0.18);
          padding: 48px 40px 40px 64px;
          font-family: var(--font-body);
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          transform-origin: top center;
          animation: paperSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          z-index: 5;
        }

        @keyframes paperSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) rotate(1deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        /* Red Margin Line on notebook sheet */
        .notepad-container::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 48px;
          width: 2px;
          background-color: rgba(239, 68, 68, 0.3);
        }

        /* Horizontal lines pattern */
        .notepad-lines {
          background-image: repeating-linear-gradient(
            transparent, 
            transparent 31px, 
            rgba(59, 130, 246, 0.08) 31px, 
            rgba(59, 130, 246, 0.08) 32px
          );
          background-attachment: local;
        }

        /* Animated Strikethroughs */
        .checklist-item-crossed {
          position: relative;
          color: var(--text-muted);
          text-decoration: none;
          display: inline-block;
        }

        .checklist-item-crossed::after {
          content: '';
          position: absolute;
          left: 0;
          top: 55%;
          height: 3px;
          background-color: var(--accent-red);
          border-radius: 4px;
          width: 0%;
          transform: translateY(-50%) rotate(-1deg);
          animation: drawLine 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .item-1::after { animation-delay: 0.6s; }
        .item-2::after { animation-delay: 1.4s; }
        .item-3::after { animation-delay: 2.2s; }

        @keyframes drawLine {
          to { width: 105%; }
        }

        /* Soft green highlight marker animation */
        .checklist-item-highlight {
          position: relative;
          display: inline-block;
          font-weight: 700;
          color: var(--text-primary);
        }

        .checklist-item-highlight::before {
          content: '';
          position: absolute;
          left: -4px;
          right: -4px;
          top: 10%;
          bottom: 5%;
          background: rgba(16, 185, 129, 0.18);
          border-radius: 2px;
          z-index: -1;
          transform: skewX(-10deg);
          width: 0%;
          animation: markerHighlight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 3s;
        }

        @keyframes markerHighlight {
          to { width: 105%; }
        }

        /* Soft neon-green glowing dot */
        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: var(--accent-green);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse 1.6s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        /* Holographic Holo Sheen Card Preview */
        .holo-card-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .holo-card-preview:hover {
          transform: translateY(-4px) rotate(1deg);
          box-shadow: 0 12px 32px rgba(0,0,0,0.25);
        }
        .holo-card-preview::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            125deg, 
            transparent 0%, 
            rgba(255,255,255,0.08) 30%, 
            rgba(255,255,255,0.3) 40%, 
            rgba(255,255,255,0.08) 50%, 
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .holo-card-preview:hover::after {
          transform: translateX(100%);
        }

        /* Post-it / Polaroid Styling for Testimonials */
        .post-it {
          background-color: #ffffff;
          padding: 24px;
          border: 1px solid rgba(220, 215, 205, 0.5);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.06);
          border-radius: 8px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .post-it:hover {
          transform: translateY(-5px) rotate(0deg) !important;
          box-shadow: 0 16px 36px -8px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* Grid Pattern Background Page Shell */}
      <div style={{
        backgroundColor: '#F5F2ED',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        minHeight: '100vh',
        width: '100vw',
        padding: '60px 24px 100px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        
        {/* Brand Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '40px',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <Sparkle size={26} color="var(--accent-terracotta)" weight="fill" />
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.4rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            PokéPrice Tracker
          </span>
        </div>

        {/* ================= MAIN CHECKLIST SHEET ================= */}
        <div className="notepad-container notepad-lines">
          
          {/* Header Row */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'var(--accent-terracotta)', 
              fontWeight: 700, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px'
            }}>
              DAILY COLLECTING ROUTINE
            </span>
            <h1 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', 
              fontWeight: 500, 
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Stop Checking Card Prices
            </h1>
          </div>

          {/* Checklist Area */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            marginBottom: '40px',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            lineHeight: 1.7
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>[x]</span>
              <span className="checklist-item-crossed item-1">Manually checking TCGplayer</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>[x]</span>
              <span className="checklist-item-crossed item-2">Missing eBay "Buy It Now" deals</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>[x]</span>
              <span className="checklist-item-crossed item-3">Guessing my portfolio's value</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="pulse-dot" />
              <span className="checklist-item-highlight">PokéPrice Tracker Alerts 🚀</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 0 32px 0' }} />

          {/* ================= INTERACTIVE SEARCH ALERT SIMULATOR ================= */}
          <div style={{ 
            background: 'var(--bg-white)', 
            border: '1px solid rgba(220, 215, 205, 0.6)',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(60, 55, 45, 0.04)'
          }}>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem', 
              fontWeight: 500, 
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              Try it: Watch a card right now
            </h3>

            {!selectedCard ? (
              // Search Input Form
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MagnifyingGlass 
                    size={20} 
                    style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} 
                  />
                  <input 
                    id="card-search-input"
                    type="text" 
                    placeholder="Enter card name (e.g. Charizard, Gengar, Umbreon)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }
                        if (searchQuery.trim().length >= 2) {
                          setLoading(true);
                          setShowResults(true);
                          searchCards(searchQuery).then(results => {
                            setSearchResults(results.slice(0, 6));
                            setLoading(false);
                          }).catch(err => {
                            console.error(err);
                            setLoading(false);
                          });
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      border: '1.5px solid var(--border-warm)',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {loading && (
                    <Spinner 
                      size={20} 
                      className="spin" 
                      style={{ position: 'absolute', right: '16px', color: 'var(--accent-terracotta)' }} 
                    />
                  )}
                </div>

                {/* Dropdown Results */}
                {showResults && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-white)',
                    border: '1px solid var(--border-warm)',
                    borderRadius: '8px',
                    boxShadow: '0 12px 32px rgba(31, 36, 33, 0.15)',
                    zIndex: 10,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {searchResults.map((card) => (
                      <div 
                        key={card.id}
                        onClick={() => handleSelectCard(card)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border-warm)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img 
                          src={card.images.small} 
                          alt={card.name} 
                          style={{ width: '40px', height: 'auto', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{card.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.setName} · {card.rarity || 'Normal'}</div>
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {formatPrice(getCardPrice(card))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showResults && searchResults.length === 0 && !loading && searchQuery.length >= 2 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-white)',
                    border: '1px solid var(--border-warm)',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    boxShadow: '0 12px 32px rgba(31, 36, 33, 0.1)',
                    zIndex: 10
                  }}>
                    No cards found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              // Selected Card Alert Configurator
              <div style={{ 
                animation: 'fadeInUp 0.3s ease-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}>
                  {/* Card Thumbnail */}
                  <div className="holo-card-preview" style={{ width: '120px', flexShrink: 0 }}>
                    <img 
                      src={selectedCard.images.small} 
                      alt={selectedCard.name} 
                      style={{ width: '100%', display: 'block' }} 
                    />
                  </div>

                  {/* Card Details & Target Price Selector */}
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {selectedCard.name}
                        </h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {selectedCard.setName}
                        </span>
                      </div>
                      <button 
                        onClick={handleClearCard}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-red)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        <Trash size={14} /> Remove
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                          Market Price
                        </span>
                        <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatPrice(getCardPrice(selectedCard))}
                        </div>
                      </div>

                      <div>
                        <label 
                          htmlFor="target-price-input"
                          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}
                        >
                          Target Price ({country.currencySymbol})
                        </label>
                        <input 
                          id="target-price-input"
                          type="number" 
                          step="0.01"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1.5px solid var(--border-warm)',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Trigger CTA */}
                <button 
                  onClick={handleCtaClick}
                  className="btn-primary" 
                  disabled={creatingAlert}
                  style={{ 
                    justifyContent: 'center', 
                    padding: '16px', 
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 24px rgba(196, 97, 47, 0.25)',
                    width: '100%',
                    opacity: creatingAlert ? 0.75 : 1
                  }}
                >
                  {creatingAlert ? (
                    <>
                      <Spinner size={18} className="spin" /> Setting Alert...
                    </>
                  ) : (
                    <>
                      <Bell size={18} weight="fill" /> Get Price Alerts for {selectedCard.name}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick demo links */}
            {!selectedCard && (
              <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Try searching: {' '}
                <button 
                  onClick={() => handleSelectCard({
                    id: 'sv3pt5-198',
                    name: 'Charizard ex',
                    setName: 'Scarlet & Violet 151',
                    images: { small: 'https://images.pokemontcg.io/sv3pt5/198.png' },
                    tcgplayer: { prices: { holofoil: { market: 120.50 } } }
                  })}
                  style={{ color: 'var(--accent-terracotta)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Charizard ex
                </button>,{' '}
                <button 
                  onClick={() => handleSelectCard({
                    id: 'swsh8-251',
                    name: 'Umbreon VMAX (Alt Art)',
                    setName: 'Evolving Skies',
                    images: { small: 'https://images.pokemontcg.io/swsh8/251.png' },
                    tcgplayer: { prices: { holofoil: { market: 850.00 } } }
                  })}
                  style={{ color: 'var(--accent-terracotta)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Umbreon VMAX
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= LOCALIZED TESTIMONIALS SECTION ================= */}
        <div style={{ 
          maxWidth: '1000px', 
          width: '100%', 
          marginTop: '80px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.8rem', 
            fontWeight: 500, 
            textAlign: 'center', 
            marginBottom: '40px',
            color: 'var(--text-primary)'
          }}>
            Trusted by Serious Pokémon Investors
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '28px' 
          }}>
            {activeTestimonials.map((t, i) => {
              // Alternate small rotations for a hand-crafted post-it look
              const rotation = i === 0 ? '-1.5deg' : i === 1 ? '1.2deg' : '-0.8deg';
              return (
                <div 
                  key={i} 
                  className="post-it"
                  style={{ transform: `rotate(${rotation})` }}
                >
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={16} weight="fill" color="var(--accent-terracotta)" />
                    ))}
                  </div>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.65, 
                    fontSize: '0.95rem', 
                    fontStyle: 'italic',
                    marginBottom: '16px',
                    minHeight: '80px'
                  }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {t.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {t.loc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FINAL MINIMAL CTA & FOOTER ================= */}
        <div style={{ 
          marginTop: '80px', 
          textAlign: 'center', 
          maxWidth: '500px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <button 
            onClick={handleCtaClick}
            className="btn-primary" 
            style={{ 
              fontSize: '1.15rem', 
              padding: '18px 36px', 
              boxShadow: '0 8px 32px rgba(196, 97, 47, 0.2)',
              marginBottom: '20px'
            }}
          >
            {user ? (
              <>
                Go to Dashboard <ArrowRight weight="bold" size={18} />
              </>
            ) : (
              <>
                Create Your Free Account <ArrowRight weight="bold" size={18} />
              </>
            )}
          </button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '32px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} color="var(--accent-green)" weight="fill" /> No Credit Card Required
            </span>
            <span>·</span>
            <span>Free Forever</span>
            <span>·</span>
            <span>Cancel Anytime</span>
          </div>

          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)', 
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '20px'
          }}>
            © 2026 PokéPrice Tracker · <a href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</a> · <a href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</a>
          </div>
        </div>

      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode="signup" />
    </>
  );
};

export default LPChecklist;
