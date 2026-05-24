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

  // Apply theme class to <html> and <body> for CSS variable switching
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
    // Ensure body background transition is smooth
    document.body.classList.add('theme-transition');
  }, [darkMode]);

  // Persist preference
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch {
      // storage unavailable – silent fail
    }

    logEvent('dark_mode_changed', {
      mode: darkMode ? 'dark' : 'light',
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, [darkMode]);

  // Log initial preference on mount
  useEffect(() => {
    logEvent('user_preference_loaded', {
      dark_mode: darkMode,
      timestamp: new Date().toISOString(),
    });
    setUserProperties({ prefers_dark_mode: darkMode });
  }, []); // only on mount

  const toggle = useCallback(() => setDarkMode(prev => !prev), []);

  return [darkMode, toggle];
}