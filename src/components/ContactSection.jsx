import { useEffect, useCallback } from 'react';
import { useContactForm } from '../hooks/useContactForm';
import { logEvent } from '../firebase/analytics';
import theme from '../constants/theme';

export default function ContactSection({ darkMode }) {
  const { contact, setContact, sent, setSent, error, sending, submit } = useContactForm();
  const isDark = darkMode;

  // Analytics: track successful submission
  useEffect(() => {
    if (sent) {
      logEvent('contact_form_submitted', {
        timestamp: new Date().toISOString(),
      });
    }
  }, [sent]);

  // Clear error on any field change
  const handleChange = useCallback(
    (field, value) => {
      setContact((prev) => ({ ...prev, [field]: value }));
    },
    [setContact]
  );

  const inputStyle = {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 12,
    padding: '12px 16px',
    color: isDark ? '#f1f0ff' : '#1a1035',
    fontSize: 15,
    fontFamily: theme.fonts.body,
    fontWeight: 400,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: isDark
      ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
      : 'inset 0 2px 4px rgba(0,0,0,0.02)',
  };

  const focusStyle = (e) => (e.target.style.borderColor = '#7c3aed');
  const blurStyle = (e) =>
    (e.target.style.borderColor = isDark
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.1)');

  return (
    <section
      style={{
        margin: `0 clamp(16px, 5vw, 32px)`,
        padding: 'clamp(32px, 6vw, 48px) 0 0',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        animation: 'fadeUp 0.5s ease',
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 'clamp(28px, 6vw, 40px)',
          fontWeight: 700,
          background: isDark
            ? 'linear-gradient(135deg, #ffffff, #c4b5fd)'
            : 'linear-gradient(135deg, #1a1035, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}
      >
        Get in Touch
      </h2>
      <p
        style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          marginBottom: 28,
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        Have questions or feedback? We’d love to hear from you.
      </p>

      {sent ? (
        <div
          className="animate-scale-in"
          style={{
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.25)',
            borderRadius: 24,
            padding: 'clamp(32px, 6vw, 40px)',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              fontSize: 52,
              marginBottom: 16,
              color: '#34d399',
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#34d399',
              marginBottom: 24,
            }}
          >
            Message Sent Successfully!
          </div>
          <button
            onClick={() => {
              setSent(false);
              setContact({ name: '', email: '', subject: '', message: '' });
            }}
            style={{
              padding: '14px 32px',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.4)',
              borderRadius: 14,
              color: '#34d399',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(52,211,153,0.2)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(52,211,153,0.12)')
            }
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div
          style={{
            background: isDark
              ? 'rgba(30,20,60,0.5)'
              : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
            borderRadius: 24,
            padding: 'clamp(24px, 5vw, 36px)',
            boxShadow: isDark
              ? '0 12px 32px rgba(0,0,0,0.4)'
              : '0 12px 32px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginBottom: 18,
            }}
          >
            <input
              type="text"
              placeholder="Your name *"
              value={contact.name}
              onChange={(e) => handleChange('name', e.target.value)}
              aria-label="Your name"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <input
              type="email"
              placeholder="Email address *"
              value={contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-label="Email address"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={contact.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            aria-label="Subject"
            style={{ ...inputStyle, marginBottom: 18 }}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />

          <textarea
            rows={5}
            placeholder="Write your message here... *"
            value={contact.message}
            onChange={(e) => handleChange('message', e.target.value)}
            aria-label="Message"
            style={{
              ...inputStyle,
              minHeight: 130,
              marginBottom: 24,
              resize: 'vertical',
            }}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />

          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12,
                padding: '14px 18px',
                fontSize: 14,
                color: '#fca5a5',
                marginBottom: 18,
                backdropFilter: 'blur(8px)',
                fontWeight: 500,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={sending}
            aria-label="Send message"
            style={{
              width: '100%',
              padding: 'clamp(14px, 3vw, 17px)',
              background: sending
                ? 'rgba(124,58,237,0.5)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              fontSize: 'clamp(15px, 3.5vw, 17px)',
              fontWeight: 600,
              cursor: sending ? 'not-allowed' : 'pointer',
              boxShadow: sending
                ? 'none'
                : '0 8px 20px rgba(124,58,237,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.25s ease',
              letterSpacing: '0.02em',
            }}
          >
            {sending ? (
              <>
                <div
                  className="loading-spinner"
                  style={{ width: 18, height: 18, borderWidth: 2 }}
                />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      )}
    </section>
  );
}