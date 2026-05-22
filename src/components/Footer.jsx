export default function Footer({ darkMode }) {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: `clamp(28px, 5vw, 36px) clamp(16px, 4vw, 24px)`,
        marginTop: `clamp(28px, 5vw, 36px)`,
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: 'clamp(15px, 3.5vw, 17px)',
          fontFamily: 'ui-sans-serif',
          color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        }}
      >
        Crafted by{' '}
        <a
          href="https://usmanmurtaza.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}
        >
          Usman Murtaza
        </a>
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(11px, 2.5vw, 12px)',
          color: darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Nexa Calculator v2.0 — Academic Excellence Suite
      </p>
    </footer>
  );
}