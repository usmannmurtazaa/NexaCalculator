import { useState, useEffect, useCallback } from 'react';
import { logEvent, setUserProperties } from '../firebase/analytics';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Apply theme to <html> for CSS variable switching and smooth transitions
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.add('theme-transition');
  }, [darkMode]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch {}
    logEvent('dark_mode_changed', {
      mode: darkMode ? 'dark' : 'light',
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, [darkMode]);

  useEffect(() => {
    logEvent('user_preference_loaded', {
      dark_mode: darkMode,
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, []);

  const toggle = useCallback(() => setDarkMode(prev => !prev), []);

  return [darkMode, toggle];
}