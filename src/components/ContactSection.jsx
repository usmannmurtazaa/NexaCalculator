import { useContactForm } from '../hooks/useContactForm';
import theme from '../constants/theme';

export default function ContactSection({ darkMode }) {
  const { contact, setContact, sent, setSent, error, sending, submit } = useContactForm();
  const isDark = darkMode;

  const inputStyle = {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'}`,
    borderRadius: 12,
    padding: '12px 14px',
    color: isDark ? '#fff' : '#333',
    fontSize: 14,
    fontFamily: theme.fonts.body,
    outline: 'none',
    transition: 'border-color 0.2s',
    display: 'block',
  };

  return (
    <div
      style={{
        margin: `0 clamp(16px, 4vw, 24px)`,
        padding: `clamp(28px, 5vw, 36px) 0 0`,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 'clamp(28px, 6vw, 36px)',
          fontWeight: 700,
          background: isDark
            ? 'linear-gradient(135deg, #fff, #c4b5fd)'
            : 'linear-gradient(135deg, #333, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}
      >
        Get in Touch
      </h2>
      <p
        style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
          marginBottom: 24,
        }}
      >
        Have questions or feedback? We'd love to hear from you.
      </p>

      {sent ? (
        <div
          style={{
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 20,
            padding: 'clamp(28px, 5vw, 36px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#34d399' }}>
            Message Sent Successfully!
          </div>
          <button
            onClick={() => {
              setSent(false);
              setContact({ name: '', email: '', subject: '', message: '' });
            }}
            style={{
              marginTop: 24,
              padding: '12px 28px',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: 12,
              color: '#34d399',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 24,
            padding: 'clamp(24px, 4vw, 32px)',
          }}
        >
          <div
            className="contact-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 18 }}
          >
            <input
              type="text"
              placeholder="Your name *"
              value={contact.name}
              onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email address *"
              value={contact.email}
              onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            value={contact.subject}
            onChange={e => setContact(p => ({ ...p, subject: e.target.value }))}
            style={{ ...inputStyle, marginBottom: 18 }}
          />
          <textarea
            rows={5}
            placeholder="Write your message here... *"
            value={contact.message}
            onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
            style={{ ...inputStyle, minHeight: 120, marginBottom: 24 }}
          />
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12,
                padding: '14px 18px',
                fontSize: 14,
                color: '#fca5a5',
                marginBottom: 18,
              }}
            >
              ⚠️ {error}
            </div>
          )}
          <button
            onClick={submit}
            disabled={sending}
            style={{
              width: '100%',
              padding: 'clamp(14px, 3vw, 17px)',
              background: sending
                ? 'rgba(124,58,237,0.5)'
                : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              fontSize: 'clamp(15px, 3.5vw, 17px)',
              fontWeight: 600,
              cursor: sending ? 'not-allowed' : 'pointer',
              boxShadow: sending ? 'none' : '0 8px 20px rgba(124, 58, 237, 0.3)',
            }}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      )}
    </div>
  );
}