import theme from '../constants/theme';

/**
 * Premium Header component with glassmorphism, animated visitor badge,
 * and accessible dark mode toggle.
 */
export default function Header({ darkMode, toggleDarkMode, visitors }) {
  return (
    <header
      style={{
        position: 'relative',
        background: darkMode
          ? 'linear-gradient(180deg, #0f0829 0%, rgba(8, 6, 23, 0.95) 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, rgba(245, 245, 245, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        padding: `clamp(16px, 4vw, 24px) clamp(16px, 5vw, 32px) 0`,
        zIndex: 10,
      }}
    >
      <div
        className="header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'clamp(12px, 3vw, 24px)',
          padding: 'clamp(14px, 3vw, 18px) 0 0',
        }}
      >
        {/* Brand section */}
        <div style={{ flex: '1 1 auto', minWidth: 200 }}>
          <h1
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(24px, 6vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              background: darkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #1a1035 0%, #7c3aed 50%, #6d28d9 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 4px 0',
            }}
          >
            Nexa Calculator
          </h1>
          <p
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              color: darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.55)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Academic Excellence Suite • GPA • CGPA • Scientific
          </p>
        </div>

        {/* Actions: dark mode toggle + visitor badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
            flexShrink: 0,
          }}
        >
          {/* Dark mode toggle button */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              background: darkMode
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = darkMode
                ? 'rgba(124,58,237,0.15)'
                : 'rgba(124,58,237,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = darkMode
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.7)';
            }}
          >
            {/* Sun/Moon SVG icons */}
            {darkMode ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                color="#f59e0b"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                color="#6366f1"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Visitor badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: darkMode
                ? 'rgba(124,58,237,0.12)'
                : 'rgba(124,58,237,0.06)',
              border: `1px solid ${darkMode ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.15)'}`,
              borderRadius: 30,
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#a78bfa',
                boxShadow: '0 0 10px #a78bfa',
                animation: 'pulse 2s infinite',
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 'clamp(13px, 3vw, 15px)',
                fontWeight: 600,
                color: darkMode ? '#c4b5fd' : '#7c3aed',
                lineHeight: 1,
              }}
            >
              {visitors.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                color: darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}