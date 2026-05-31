import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// ── Helpers ────────────────────────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'nexa-theme-preference';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function getSystemDarkMode() {
  return window.matchMedia && window.matchMedia(COLOR_SCHEME_QUERY).matches;
}

function getStoredMode() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch (e) { /* ignore */ }
  return null;
}

function applyThemeAttributes(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
}

// ── Context ────────────────────────────────────────────────────────────────────
const ThemeContext = createContext({
  darkMode: true,          // computed boolean
  toggleDarkMode: () => {}, // legacy toggle
  mode: 'system',          // 'light' | 'dark' | 'system'
  setMode: () => {},       // direct setter
  isSystem: true,          // convenience flag
});

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => getStoredMode() || 'system');
  const [systemDark, setSystemDark] = useState(getSystemDarkMode);

  // Listen for OS theme changes
  useEffect(() => {
    const mql = window.matchMedia(COLOR_SCHEME_QUERY);
    const handler = (e) => setSystemDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Compute effective dark boolean
  const darkMode = useMemo(() => {
    if (mode === 'system') return systemDark;
    return mode === 'dark';
  }, [mode, systemDark]);

  // Persist mode and apply attributes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) { /* ignore */ }
    applyThemeAttributes(darkMode);
    // Smooth transition class
    document.documentElement.classList.add('theme-smooth');
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-smooth');
    }, 500);
    return () => clearTimeout(timeout);
  }, [mode, darkMode]);

  // Setter that validates input
  const setMode = useCallback((newMode) => {
    if (newMode === 'light' || newMode === 'dark' || newMode === 'system') {
      setModeState(newMode);
    }
  }, []);

  // Legacy toggle – cycles light ↔ dark, when system uses opposite of system
  const toggleDarkMode = useCallback(() => {
    if (mode === 'system') {
      // If system is dark, switch to light; if system is light, switch to dark
      setModeState(systemDark ? 'light' : 'dark');
    } else {
      setModeState(mode === 'dark' ? 'light' : 'dark');
    }
  }, [mode, systemDark]);

  const contextValue = useMemo(
    () => ({ darkMode, toggleDarkMode, mode, setMode, isSystem: mode === 'system' }),
    [darkMode, toggleDarkMode, mode, setMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}