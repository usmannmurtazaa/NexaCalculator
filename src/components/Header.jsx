import theme from '../constants/theme';

export default function Header({ darkMode, toggleDarkMode, visitors }) {
  return (
    <div
      style={{
        background: darkMode
          ? 'linear-gradient(180deg,#0f0829 0%,#080617 100%)'
          : 'linear-gradient(180deg,#fff 0%,#f5f5f5 100%)',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        padding: `clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) 0`,
      }}
    >
      <div
        className="header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(14px, 3vw, 18px) 0 0',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(24px, 6vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: darkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #333 0%, #7c3aed 50%, #6d28d9 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 4px 0',
            }}
          >
            Nexa Calculator
          </h1>
          <p
            style={{
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Academic Excellence Suite • GPA • CGPA • Scientific
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            style={{ background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer' }}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: darkMode
                ? 'rgba(124,58,237,0.15)'
                : 'rgba(124,58,237,0.08)',
              border: `1px solid ${darkMode ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}`,
              borderRadius: 30,
              padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#a78bfa',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 'clamp(13px, 3vw, 15px)',
                fontWeight: 600,
                color: darkMode ? '#c4b5fd' : '#7c3aed',
              }}
            >
              {visitors.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)',
              }}
            >
              active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}