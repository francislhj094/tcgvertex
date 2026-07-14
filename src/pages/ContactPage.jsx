import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, EnvelopeSimple, ChatCircle, Lightning, CheckCircle } from 'phosphor-react';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../translations/useTranslation';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send contact form data to backend
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `${formData.subject}\n\n${formData.message}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      console.log('Contact form submitted successfully:', result.emailId);

      addToast('✓ Message sent! We\'ll get back to you within 24 hours.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      addToast('Failed to send message. Please try again or email us directly.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1000px' }}>
      <Helmet>
        <title>Contact Us | PokéPrice Tracker</title>
        <meta name="description" content="Get in touch with PokéPrice Tracker. We're here to help with questions, feedback, and support." />
      </Helmet>

      <Link to="/" style={{
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
        <ArrowLeft weight="bold" size={20} /> {t('premium.backToHome')}
      </Link>

      {/* Header */}
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="eyebrow-pill">
            <ChatCircle size={14} weight="fill" /> Support
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          Get in <span className="text-accent">Touch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
          Have questions, feedback, or need help? We're here for you.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginBottom: '60px'
      }}>
        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '40px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EnvelopeSimple size={24} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Send us a Message</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                We typically respond within 24 hours
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {t('contact.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid var(--border-warm)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {t('contact.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.emailPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid var(--border-warm)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t('contact.subject')} *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('contact.subjectPlaceholder')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid var(--border-warm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t('contact.message')} *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.messagePlaceholder')}
                rows="6"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid var(--border-warm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                padding: '16px 32px',
                fontSize: '1.05rem',
                width: 'fit-content',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : (
                <>
                  <EnvelopeSimple size={20} weight="fill" />
                  {loading ? t('contact.sending') : t('contact.send')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Help */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'var(--accent-terracotta-tint)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Lightning size={24} color="var(--accent-terracotta)" weight="fill" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Quick Response</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              Premium users get priority support with responses within 12 hours.
            </p>
            <Link to="/premium" className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Learn About Premium
            </Link>
          </div>

          <div className="glass-panel" style={{
            padding: '24px',
            background: 'var(--bg-secondary)'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Common Questions</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li>
                <Link to="/premium" style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <CheckCircle size={18} weight="fill" />
                  How does Premium work?
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <CheckCircle size={18} weight="fill" />
                  Privacy & data security
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent-terracotta)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                  <CheckCircle size={18} weight="fill" />
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alternative Contact Methods */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, var(--accent-terracotta-tint) 0%, rgba(242, 227, 214, 0.3) 100%)',
        border: '1.5px solid rgba(196, 97, 47, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
          Need Immediate Help?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Check out our documentation or browse common questions
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/about" className="btn-outline">
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
