import { useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { logEvent, setUserProperties } from '../firebase/analytics';

/**
 * Hook to access dark mode state and toggle.
 * Now powered by the centralized ThemeContext (light / dark / system).
 * 
 * Returns: [darkMode: boolean, toggleDarkMode: function]
 * 
 * Analytics are fired automatically on every darkMode change.
 */
export function useDarkMode() {
  const { darkMode, toggleDarkMode } = useTheme();

  // Preserve existing analytics tracking
  useEffect(() => {
    logEvent('dark_mode_changed', {
      mode: darkMode ? 'dark' : 'light',
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, [darkMode]);

  return [darkMode, toggleDarkMode];
}