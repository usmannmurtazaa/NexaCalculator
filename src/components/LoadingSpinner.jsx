import theme from '../constants/theme';

/**
 * Premium loading screen with animated spinner,
 * brand name, and glassmorphism effect.
 */
export default function LoadingSpinner({ darkMode }) {
  return (
    <div
      role="alert"
      aria-busy="true"
      aria-label="Loading Nexa Calculator"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0f0c29, #1a1035 50%, #0f0c29)'
          : 'linear-gradient(135deg, #f8f9ff, #eef1ff 50%, #f8f9ff)',
        transition: 'background 0.3s ease',
        gap: 24,
        padding: 'clamp(16px, 5vw, 32px)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: darkMode
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.06)',
          animation: 'scaleIn 0.3s ease',
        }}
      >
        <div
          className="loading-spinner"
          style={{
            width: 28,
            height: 28,
            border: '3px solid rgba(124, 58, 237, 0.15)',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 'clamp(20px, 5vw, 28px)',
          fontWeight: 700,
          background: darkMode
            ? 'linear-gradient(135deg, #ffffff, #c4b5fd)'
            : 'linear-gradient(135deg, #1a1035, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          animation: 'fadeUp 0.5s ease both 0.2s',
        }}
      >
        Nexa Calculator
      </div>
    </div>
  );
}