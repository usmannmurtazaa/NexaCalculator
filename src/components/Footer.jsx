import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import theme from '../constants/theme';

export default function Footer({ darkMode: _deprecatedDarkMode }) {
  // Use the central theme context (ignores passed prop if any)
  const { darkMode } = useTheme();

  const [showBackToTop, setShowBackToTop] = useState(false);
  const ticking = useRef(false);

  // Throttled scroll handler for performance
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > 400);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
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
      {/* Back‑to‑top button with SVG icon and smooth animation */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: darkMode
              ? 'rgba(30,20,60,0.85)'
              : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${darkMode ? 'rgba(167,139,250,0.4)' : 'rgba(124,58,237,0.3)'}`,
            color: darkMode ? '#c4b5fd' : '#7c3aed',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: darkMode
              ? '0 8px 24px rgba(0,0,0,0.5)'
              : '0 8px 24px rgba(0,0,0,0.08)',
            animation: 'fadeUp 0.3s ease',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
            e.currentTarget.style.boxShadow = darkMode
              ? '0 10px 28px rgba(0,0,0,0.6)'
              : '0 10px 28px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
            e.currentTarget.style.boxShadow = darkMode
              ? '0 8px 24px rgba(0,0,0,0.5)'
              : '0 8px 24px rgba(0,0,0,0.08)';
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
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
            transition: 'color 0.2s ease, filter 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#c4b5fd';
            e.currentTarget.style.filter = 'brightness(1.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#a78bfa';
            e.currentTarget.style.filter = 'none';
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

      {/* Subtle divider with gradient */}
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