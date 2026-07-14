import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../translations/useTranslation';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Code, Key, Copy, WarningCircle, Lightning } from 'phosphor-react';
import { getDeveloperKey, generateDeveloperKey } from '../services/apiKeys';

const DeveloperDashboard = () => {
  const { t } = useTranslation();
  const { user, isPremium, loading: authLoading } = useAuth();
  const [apiKeyData, setApiKeyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isPremium) {
      loadApiKey();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, isPremium, authLoading]);

  const loadApiKey = async () => {
    setLoading(true);
    const data = await getDeveloperKey(user.uid);
    if (data) setApiKeyData(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateDeveloperKey(user.uid);
      setApiKeyData(data);
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    if (apiKeyData?.apiKey) {
      navigator.clipboard.writeText(apiKeyData.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || loading) {
    return <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
      <Helmet>
        <title>Developer API | PokéPrice Tracker</title>
      </Helmet>

      <header style={{ marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="eyebrow-pill">
            <Code size={14} weight="fill" /> API Access
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Developer <span className="text-accent">API</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Programmatic access to your portfolio and advanced market data.
        </p>
      </header>

      {!user ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <h2 style={{ marginBottom: '16px' }}>Sign In Required</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You must be signed in to access developer features.</p>
        </div>
      ) : !isPremium ? (
        <div className="glass-panel flex-center" style={{
          flexDirection: 'column', padding: '60px 40px', textAlign: 'center',
          background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, var(--bg-white) 100%)',
          border: '1.5px solid rgba(196, 97, 47, 0.3)'
        }}>
          <Lightning size={48} color="var(--accent-terracotta)" weight="fill" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Premium Feature</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '32px' }}>
            Developer API access is exclusively available for our Premium members. Upgrade now to generate your API key and integrate with your own tools.
          </p>
          <Link to="/premium" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Upgrade to Premium
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Key size={24} weight="fill" color="var(--accent-terracotta)" />
              Your API Key
            </h2>
            
            {apiKeyData ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Use this key to authenticate your API requests. Keep it secret!
                </p>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', 
                  padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-warm)' 
                }}>
                  <code style={{ flex: 1, fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    {apiKeyData.apiKey}
                  </code>
                  <button 
                    onClick={handleCopy}
                    className="btn-outline" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)' }}>
                  <WarningCircle size={20} />
                  <span style={{ fontSize: '0.9rem' }}>Never share your API key or commit it to public repositories.</span>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  You don't have an API key yet. Generate one to get started.
                </p>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-primary"
                >
                  {generating ? 'Generating...' : 'Generate API Key'}
                </button>
              </div>
            )}
          </div>

          {/* Documentation Section */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Documentation</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Authentication</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                All API requests require authentication using your API key. Include it in the <code>x-api-key</code> header.
              </p>
              <pre style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                <code>
{`curl -X GET https://tcgvertex.com/api/v1/portfolio \\
  -H "x-api-key: your_api_key_here"`}
                </code>
              </pre>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Endpoints</h3>
              
              <div style={{ border: '1px solid var(--border-warm)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--border-warm)' }}>
                  <span style={{ background: 'var(--accent-green)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>GET</span>
                  <code style={{ fontWeight: 600 }}>/api/v1/portfolio</code>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Retrieves your entire portfolio including current market prices and alert configurations.
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Response Format (JSON):</p>
                  <pre style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', overflowX: 'auto', fontSize: '0.9rem' }}>
                    <code>
{`{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "sv3pt5-1",
        "name": "Bulbasaur",
        "marketPrice": 24.50,
        "images": { "small": "...", "large": "..." }
      }
    ],
    "totalValue": 24.50,
    "count": 1
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
