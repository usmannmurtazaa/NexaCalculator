import { useMemo } from 'react';
import theme from '../constants/theme';

/**
 * Premium loading spinner with glassmorphic container, brand name,
 * and optional message. Supports three preset sizes and custom dimensions.
 *
 * Props:
 * - darkMode (bool) : theme state (required for backward compat)
 * - size ('sm' | 'md' | 'lg' | number) : spinner diameter (default 56)
 * - message (string) : optional subtitle below brand
 */
export default function LoadingSpinner({
  darkMode,
  size = 'md',
  message,
}) {
  // Convert named sizes to pixel values
  const dimensions = useMemo(() => {
    if (typeof size === 'number') return { container: size + 16, spinner: size };
    switch (size) {
      case 'sm': return { container: 40, spinner: 24 };
      case 'lg': return { container: 72, spinner: 36 };
      default: return { container: 56, spinner: 28 };
    }
  }, [size]);

  const containerStyle = useMemo(
    () => ({
      width: dimensions.container,
      height: dimensions.container,
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
    }),
    [dimensions.container, darkMode]
  );

  const spinnerStyle = useMemo(
    () => ({
      width: dimensions.spinner,
      height: dimensions.spinner,
      border: `3px solid rgba(124, 58, 237, 0.15)`,
      borderTopColor: '#7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }),
    [dimensions.spinner]
  );

  const brandStyle = useMemo(
    () => ({
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
    }),
    [darkMode]
  );

  const messageStyle = useMemo(
    () => ({
      fontFamily: theme.fonts.body,
      fontSize: 'clamp(14px, 3vw, 16px)',
      color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      fontWeight: 400,
      marginTop: -8, // tighter to brand
      animation: 'fadeUp 0.5s ease both 0.35s',
    }),
    [darkMode]
  );

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-label={`Loading Nexa Calculator${message ? ': ' + message : ''}`}
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
      {/* Glass container */}
      <div style={containerStyle}>
        <div style={spinnerStyle} />
      </div>

      {/* Brand name */}
      <div style={brandStyle}>Nexa Calculator</div>

      {/* Optional loading message */}
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );
}