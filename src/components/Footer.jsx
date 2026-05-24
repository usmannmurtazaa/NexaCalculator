import { useState, useEffect } from 'react';
import theme from '../constants/theme';

/**
 * Premium Footer with glassmorphism, animated back‑to‑top button,
 * and accessible external link.
 */
export default function Footer({ darkMode }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: `clamp(28px, 5vw, 40px) clamp(16px, 5vw, 32px)`,
        marginTop: `clamp(28px, 5vw, 48px)`,
        background: darkMode
          ? 'linear-gradient(180deg, rgba(15,12,35,0.4), rgba(15,12,35,0.6))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(245,245,255,0.6))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: darkMode
          ? '0 -8px 32px rgba(0,0,0,0.3)'
          : '0 -8px 32px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Back‑to‑top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: darkMode
              ? 'rgba(30,20,60,0.8)'
              : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.2)'}`,
            color: darkMode ? '#c4b5fd' : '#7c3aed',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: darkMode
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.08)',
            animation: 'fadeUp 0.3s ease',
            zIndex: 10,
          }}
        >
          ↑
        </button>
      )}

      {/* Brand line */}
      <p
        style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(15px, 3.5vw, 17px)',
          fontFamily: theme.fonts.body,
          color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontWeight: 500,
        }}
      >
        Crafted by{' '}
        <a
          href="https://usmanmurtaza.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Usman Murtaza's portfolio (opens in new tab)"
          style={{
            color: '#a78bfa',
            fontWeight: 700,
            textDecoration: 'none',
            position: 'relative',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#c4b5fd';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#a78bfa';
          }}
        >
          Usman Murtaza
        </a>
      </p>

      {/* Tagline */}
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: 'clamp(11px, 2.5vw, 12px)',
          color: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: 500,
          fontFamily: theme.fonts.mono,
        }}
      >
        Nexa Calculator v2.0 — Academic Excellence Suite
      </p>

      {/* Subtle divider */}
      <div
        aria-hidden="true"
        style={{
          width: '60px',
          height: 2,
          margin: '0 auto 12px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)',
          borderRadius: 1,
        }}
      />

      {/* Copyright */}
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        }}
      >
        &copy; {currentYear} Nexa Calculator. All rights reserved.
      </p>
    </footer>
  );
}