import { useState, useEffect } from 'react';
import { logEvent, setUserProperties } from '../firebase/analytics';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true; // fallback dark
    }
  });

  // Persist preference and log to Firebase
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch {
      // storage unavailable – silent fail
    }

    // Firebase analytics
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

  return [darkMode, setDarkMode];
}