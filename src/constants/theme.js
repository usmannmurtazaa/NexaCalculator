// ── Core Tokens (unchanged, extended) ────────────────────────────────────────
const theme = {
  colors: {
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    backgroundDark: '#080617',
    backgroundLight: '#f5f5f5',
    cardDark: 'rgba(255,255,255,0.03)',
    cardLight: 'rgba(0,0,0,0.02)',
    borderDark: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(0,0,0,0.08)',
    textPrimaryDark: '#fff',
    textPrimaryLight: '#333',
    textSecondaryDark: 'rgba(255,255,255,0.5)',
    textSecondaryLight: 'rgba(0,0,0,0.5)',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
    section: 'clamp(32px, 6vw, 64px)',
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  fonts: {
    heading: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    lg: '0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    xl: '0 20px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.04)',
    glow: '0 0 20px rgba(124, 58, 237, 0.15)',
    darkSm: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
    darkMd: '0 4px 12px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
    darkLg: '0 12px 32px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)',
    darkGlow: '0 0 24px rgba(124, 58, 237, 0.25)',
  },

  animation: '0.3s ease',

  // ── New design tokens (no removal, only additions) ────────────────────────
  breakpoints: {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  zIndex: {
    dropdown: 10,
    sticky: 20,
    modal: 100,
    toast: 200,
    tooltip: 300,
  },

  typography: {
    heading1: {
      fontSize: 'clamp(28px, 6vw, 48px)',
      lineHeight: 1.2,
      fontWeight: 700,
      fontFamily: "'Playfair Display', serif",
    },
    heading2: {
      fontSize: 'clamp(22px, 4vw, 36px)',
      lineHeight: 1.3,
      fontWeight: 600,
      fontFamily: "'Playfair Display', serif",
    },
    heading3: {
      fontSize: 'clamp(18px, 3vw, 24px)',
      lineHeight: 1.4,
      fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
    },
    bodyLarge: {
      fontSize: 'clamp(15px, 2.5vw, 18px)',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body: {
      fontSize: 'clamp(14px, 2vw, 16px)',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: 'clamp(12px, 1.5vw, 14px)',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    caption: {
      fontSize: 'clamp(10px, 1.5vw, 12px)',
      lineHeight: 1.4,
      fontWeight: 400,
    },
  },

  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    base: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ── Dynamic CSS Variable Generator ──────────────────────────────────────────
export function generateCSSVariables(darkMode) {
  return {
    // Primary palette
    '--color-primary': theme.colors.primary,
    '--color-primary-light': theme.colors.primaryLight,
    '--color-primary-dark': theme.colors.primaryDark,

    // Backgrounds
    '--bg-app': darkMode
      ? `linear-gradient(135deg, ${theme.colors.backgroundDark}, #1a1035 25%, #2d1b4e 75%, ${theme.colors.backgroundDark})`
      : `linear-gradient(135deg, ${theme.colors.backgroundLight}, #eef1ff 25%, #f0e6ff 75%, ${theme.colors.backgroundLight})`,
    '--bg-ambient': darkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(120,50,220,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80,150,255,0.06) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(120,50,220,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80,150,255,0.03) 0%, transparent 50%)',

    // Text
    '--text-primary': darkMode
      ? theme.colors.textPrimaryDark
      : theme.colors.textPrimaryLight,
    '--text-secondary': darkMode
      ? theme.colors.textSecondaryDark
      : theme.colors.textSecondaryLight,
    '--text-tertiary': darkMode
      ? 'rgba(255,255,255,0.45)'
      : 'rgba(0,0,0,0.45)',

    // Glass
    '--glass-bg': darkMode
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.7)',
    '--glass-border': darkMode
      ? theme.colors.borderDark
      : theme.colors.borderLight,
    '--glass-shadow': darkMode
      ? '0 8px 32px rgba(0,0,0,0.2)'
      : '0 8px 32px rgba(0,0,0,0.06)',

    // Cards
    '--card-bg': darkMode
      ? theme.colors.cardDark
      : theme.colors.cardLight,
    '--card-border': darkMode
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.06)',

    // Status colors (shared)
    '--color-error': theme.colors.error,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,

    // Focus
    '--focus-ring': theme.colors.primary,

    // Scrollbar
    '--scrollbar-thumb': '#7c3aed44',
    '--scrollbar-thumb-hover': '#7c3aed66',

    // Transitions
    '--animation-duration': '0.3s',
    '--animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
  };
}

export default theme;