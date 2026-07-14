import React, { useState } from 'react';
import { X, EnvelopeSimple, Lock, Eye, EyeSlash, User } from 'phosphor-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { syncLocalToFirestore } from '../services/vault';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { signup, login } = useAuth();

  if (!isOpen) return null;

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered. Try logging in.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const user = await signup(email, password, name);
        await syncLocalToFirestore(user.uid);
        if (window.fbq) {
          window.fbq('track', 'Purchase', { value: 0.00, currency: 'AUD' });
        }
        addToast('Account created! Welcome to PokéPrice Tracker.', 'success');
      } else {
        const user = await login(email, password);
        await syncLocalToFirestore(user.uid);
        addToast('Welcome back!', 'success');
      }
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 42px',
    border: '1.5px solid var(--border-warm)', borderRadius: 'var(--radius-md)',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <>
      <div
        onClick={() => onClose()}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(31, 36, 33, 0.5)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000, animation: 'fadeInUp 0.2s ease-out',
        }}
      />

      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 1001,
        background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-warm)',
        boxShadow: '0 24px 64px rgba(31, 36, 33, 0.2)',
        width: '90%', maxWidth: '420px',
        padding: '40px', animation: 'fadeInUp 0.3s ease-out',
      }}>
        <button
          onClick={() => onClose()}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            color: 'var(--text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px',
          }}
        >
          <X size={20} weight="bold" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {mode === 'login'
              ? 'Log in to sync your watchlist across devices'
              : 'Start tracking your TCG collection today'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-sm)', padding: '12px 16px',
            color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-warm)'} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <EnvelopeSimple size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-terracotta)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-warm)'} />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '42px' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-terracotta)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-warm)'} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-warm)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-warm)' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={switchMode}
            style={{ color: 'var(--accent-terracotta)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </>
  );
};

export default AuthModal;
