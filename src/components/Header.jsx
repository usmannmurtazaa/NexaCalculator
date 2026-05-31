import { useTheme } from './ThemeContext';
import theme from '../constants/theme';

export default function Header({ visitors }) {
  const { mode, setMode, darkMode } = useTheme();

  const themeLabel = mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light';
  const ThemeIcon = mode === 'dark' ? SunIcon : mode === 'light' ? MoonIcon : SystemIcon;

  return (
    <header
      style={{
        position: 'relative',
        background: darkMode
          ? 'linear-gradient(180deg, rgba(15,8,41,0.95) 0%, rgba(8,6,23,0.98) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        padding: `clamp(16px, 4vw, 24px) clamp(16px, 5vw, 32px) clamp(12px, 3vw, 16px)`,
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
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Brand Section */}
        <div style={{ flex: '1 1 auto', minWidth: 200 }}>
          <h1
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(24px, 6vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              background: darkMode
                ? 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #a78bfa 100%)'
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

        {/* Actions: Theme Selector + Visitor Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
            flexShrink: 0,
          }}
        >
          {/* Theme Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                const menu = document.getElementById('theme-menu');
                if (menu) menu.classList.toggle('hidden');
              }}
              aria-label={`Theme: ${themeLabel}`}
              aria-haspopup="listbox"
              aria-expanded="false"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: darkMode
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: '30px',
                padding: '6px 12px 6px 6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: darkMode
                  ? '0 4px 12px rgba(0,0,0,0.2)'
                  : '0 4px 12px rgba(0,0,0,0.04)',
                minWidth: '110px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = darkMode
                  ? 'rgba(124,58,237,0.15)'
                  : 'rgba(124,58,237,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = darkMode
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.7)';
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: darkMode
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.04)',
                }}
              >
                <ThemeIcon />
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: darkMode ? '#fff' : '#1a1035',
                }}
              >
                {themeLabel}
              </span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown menu */}
            <ul
              id="theme-menu"
              className="hidden"
              role="listbox"
              aria-label="Theme selection"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                listStyle: 'none',
                margin: 0,
                padding: '8px',
                background: darkMode
                  ? 'rgba(30,20,60,0.95)'
                  : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 12,
                boxShadow: darkMode
                  ? '0 8px 32px rgba(0,0,0,0.4)'
                  : '0 8px 32px rgba(0,0,0,0.1)',
                zIndex: 20,
                minWidth: '140px',
              }}
            >
              {['light', 'dark', 'system'].map((option) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={mode === option}
                  onClick={() => {
                    setMode(option);
                    document.getElementById('theme-menu').classList.add('hidden');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: mode === option
                      ? (darkMode ? '#c4b5fd' : '#7c3aed')
                      : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                    background: mode === option
                      ? (darkMode ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)')
                      : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode
                      ? 'rgba(124,58,237,0.15)'
                      : 'rgba(124,58,237,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (mode !== option) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {option === 'light' && <SunIcon />}
                  {option === 'dark' && <MoonIcon />}
                  {option === 'system' && <SystemIcon />}
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          {/* Visitor Badge */}
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
              padding: '6px 14px',
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

// ── Icon components (inline SVGs, aria-hidden) ──────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#f59e0b" aria-hidden="true">
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
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#6366f1" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#8b5cf6" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);