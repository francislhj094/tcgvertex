import React, { useState, useEffect } from 'react';
import { ShareNetwork, X, Copy, Check, GlobeHemisphereWest, LockKey } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';
import { setVaultPublicStatus } from '../services/vault';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ShareModal = ({ isOpen, onClose }) => {
  const { user, isPremium } = useAuth();
  const [isPublic, setIsPublic] = useState(false);
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (user && isOpen) {
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
        }
      }
    };
    loadSettings();
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    if (!username.trim()) return;
    setSaving(true);
    await setVaultPublicStatus(user.uid, isPublic, username.trim().toLowerCase());
    setSaving(false);
  };

  const shareUrl = `${window.location.origin}/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
        width: '90%', maxWidth: '450px', padding: '32px', position: 'relative'
      }}>
        <button className="icon-btn" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShareNetwork size={24} color="var(--accent-terracotta)" /> Share Portfolio
        </h2>
        
        {!isPremium ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <GlobeHemisphereWest size={48} color="var(--accent-terracotta)" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h3>Premium Feature</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Upgrade to Premium to generate a public link and show off your collection to the world.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.location.href = '/premium'}>
              Upgrade Now
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px' }}>Public Profile</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Allow anyone with the link to view your cards.</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isPublic} 
                  onChange={(e) => setIsPublic(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-terracotta)' }}
                />
              </label>
            </div>

            {isPublic && (
              <>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Your Custom URL</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-warm)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>tcgvertex.com/u/</span>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                      style={{ border: 'none', background: 'transparent', padding: '12px 0', flex: 1, outline: 'none', color: 'var(--text-primary)', fontWeight: 500 }}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <input type="text" readOnly value={shareUrl} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-warm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
                  <button onClick={handleCopy} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {copied ? <Check size={18} color="var(--accent-green)" /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }} 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
