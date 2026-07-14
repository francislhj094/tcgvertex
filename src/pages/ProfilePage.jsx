import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserCircle, ShieldCheck, Gear, ShareNetwork, LockKey, GlobeHemisphereWest, Check, Copy } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { setVaultPublicStatus } from '../services/vault';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isPremium } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('account');
  const [isPublic, setIsPublic] = useState(false);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setIsPublic(data.isPublicVault || false);
            if (data.username) {
              setUsername(data.username);
            } else {
              setUsername(user.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSettings();
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  const handleSavePublicSettings = async () => {
    if (!username.trim()) return;
    setSaving(true);
    await setVaultPublicStatus(user.uid, isPublic, username.trim().toLowerCase());
    addToast('Public profile settings saved!', 'success');
    setSaving(false);
  };

  const shareUrl = `${window.location.origin}/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
      <Helmet>
        <title>Account Settings | PokéPrice Tracker</title>
      </Helmet>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-terracotta)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '2rem',
          boxShadow: '0 8px 24px rgba(196, 97, 47, 0.3)'
        }}>
          {firstLetter}
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>Account Settings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>Manage your profile, subscription, and public links.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'start' }}>
        <style>{`
          @media (min-width: 768px) {
            .profile-layout {
              grid-template-columns: 240px 1fr !important;
            }
          }
          .tab-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 16px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font-size: 1.05rem;
            font-weight: 500;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }
          .tab-btn:hover {
            background: var(--bg-white);
            color: var(--text-primary);
          }
          .tab-btn.active {
            background: var(--bg-white);
            color: var(--accent-terracotta);
            box-shadow: 0 4px 12px rgba(31, 36, 33, 0.05);
            border-left: 3px solid var(--accent-terracotta);
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        `}</style>
        
        <div className="profile-layout" style={{ display: 'grid', gap: '48px' }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
              <UserCircle size={24} weight={activeTab === 'account' ? 'fill' : 'regular'} /> Account Details
            </button>
            <button className={`tab-btn ${activeTab === 'subscription' ? 'active' : ''}`} onClick={() => setActiveTab('subscription')}>
              <ShieldCheck size={24} weight={activeTab === 'subscription' ? 'fill' : 'regular'} /> Subscription
            </button>
            <button className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`} onClick={() => setActiveTab('public')}>
              <ShareNetwork size={24} weight={activeTab === 'public' ? 'fill' : 'regular'} /> Public Profile
            </button>
          </div>

          {/* Content Area */}
          <div className="glass-panel" style={{ padding: '40px', minHeight: '400px' }}>
            
            {activeTab === 'account' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gear size={24} color="var(--accent-terracotta)" /> General Information
                </h3>
                
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Display Name</label>
                  <input type="text" value={user.name} readOnly style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-warm)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'not-allowed' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Display name cannot be changed currently.</span>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Email Address</label>
                  <input type="email" value={user.email} readOnly style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-warm)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'not-allowed' }} />
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={24} color="var(--accent-green)" /> Your Plan
                </h3>

                {isPremium ? (
                  <div style={{ background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)', border: '1.5px solid var(--accent-green)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center' }}>
                    <ShieldCheck size={48} color="var(--accent-green)" weight="fill" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>Premium Member</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 0 24px' }}>You have Lifetime Access to all features.</p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={18} color="var(--accent-green)" /> Unlimited Cards</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={18} color="var(--accent-green)" /> Instant Alerts</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)', border: '1.5px solid var(--border-warm)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center' }}>
                    <LockKey size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>Free Plan</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 0 24px' }}>You are currently on the free tier (10 cards max).</p>
                    <Link to="/premium" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                      Upgrade to Premium
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'public' && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShareNetwork size={24} color="var(--accent-terracotta)" /> Public Profile
                </h3>

                {loading ? (
                  <p>Loading settings...</p>
                ) : !isPremium ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <GlobeHemisphereWest size={64} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Premium Feature</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 32px' }}>
                      Upgrade to Premium to generate a public link and show off your collection to the world.
                    </p>
                    <Link to="/premium" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                      Upgrade Now
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-warm)' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Enable Public Vault</h4>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Allow anyone with the link to view your cards and collection value.</p>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                        <input 
                          type="checkbox" 
                          checked={isPublic} 
                          onChange={(e) => setIsPublic(e.target.checked)} 
                          style={{ width: '48px', height: '24px', appearance: 'none', background: isPublic ? 'var(--accent-terracotta)' : 'var(--text-muted)', borderRadius: '12px', outline: 'none', transition: '0.3s', cursor: 'pointer' }}
                        />
                        <div style={{ position: 'absolute', width: '20px', height: '20px', background: 'white', borderRadius: '50%', top: '2px', left: isPublic ? '26px' : '2px', transition: '0.3s', pointerEvents: 'none' }} />
                      </label>
                    </div>

                    {isPublic && (
                      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                          <label style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Your Custom URL</label>
                          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-warm)', borderRadius: 'var(--radius-sm)', padding: '0 16px', transition: 'border-color 0.2s' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>tcgvertex.com/u/</span>
                            <input 
                              type="text" 
                              value={username} 
                              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                              style={{ border: 'none', background: 'transparent', padding: '16px 0', flex: 1, outline: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}
                              placeholder="username"
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                          <input type="text" readOnly value={shareUrl} style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-warm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '1rem' }} />
                          <button onClick={handleCopy} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
                            {copied ? <Check size={20} color="var(--accent-green)" /> : <Copy size={20} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </div>
                    )}

                    <button 
                      className="btn-primary" 
                      style={{ padding: '14px 32px', fontSize: '1.05rem' }} 
                      onClick={handleSavePublicSettings}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
