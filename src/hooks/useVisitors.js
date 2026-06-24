import { useState, useEffect, useRef, useCallback } from 'react';
import { logEvent } from '../firebase/analytics';

export function useVisitors(initial = 1312) {
  const [visitors, setVisitors] = useState(initial);
  const visitorsRef = useRef(visitors);
  const intervalRef = useRef(null);

  useEffect(() => {
    visitorsRef.current = visitors;
  }, [visitors]);

  useEffect(() => {
    // Log initial session
    if (typeof logEvent === 'function') {
      logEvent('visitor_active', {
        initial_count: visitorsRef.current,
        timestamp: new Date().toISOString(),
      });
    }

    intervalRef.current = setInterval(() => {
      setVisitors((prev) => {
        if (Math.random() > 0.6) {
          const increment = Math.floor(Math.random() * 2) + 1;
          const newCount = prev + increment;

          // Milestone logging every 10 new visitors
          if (newCount % 10 === 0 && typeof logEvent === 'function') {
            logEvent('visitor_milestone', {
              count: newCount,
              timestamp: new Date().toISOString(),
            });
          }
          return newCount;
        }
        return prev;
      });
    }, 3500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (typeof logEvent === 'function') {
        logEvent('visitor_session_end', {
          final_count: visitorsRef.current,
          timestamp: new Date().toISOString(),
        });
      }
    };
  }, []);

  return visitors;
}