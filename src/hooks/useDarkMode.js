import { useState, useEffect, useCallback } from 'react';
import { logEvent, setUserProperties } from '../firebase/analytics';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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

  const toggle = useCallback(() => setDarkMode(prev => !prev), []);

  return [darkMode, toggle];
}