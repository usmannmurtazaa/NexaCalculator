import { useState, useEffect, useRef, useCallback } from 'react';
import { logEvent } from '../firebase/analytics';

/**
 * Simulates an active visitor counter with incremental updates.
 * Logs visitor analytics to Firebase on mount and periodically.
 *
 * @param {number} initial - Starting visitor count (default 1312)
 * @returns {number} current visitor count
 */
export function useVisitors(initial = 1312) {
  const [visitors, setVisitors] = useState(initial);
  const visitorsRef = useRef(visitors); // always reflects latest value
  const intervalRef = useRef(null);

  // Keep ref in sync
  useEffect(() => {
    visitorsRef.current = visitors;
  }, [visitors]);

  useEffect(() => {
    // Log initial session
    logEvent('visitor_active', {
      initial_count: visitorsRef.current,
      timestamp: new Date().toISOString(),
    });

    // Periodic update
    intervalRef.current = setInterval(() => {
      setVisitors((prev) => {
        // Realistic organic growth pattern
        if (Math.random() > 0.6) {
          const increment = Math.floor(Math.random() * 2) + 1;
          const newCount = prev + increment;

          // Milestone logging (every 10 new visitors) using the current prev value before update
          if ((prev + 1) % 10 === 0) { // slightly simpler: check after increment
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
      // Use ref to get the final accurate count
      logEvent('visitor_session_end', {
        final_count: visitorsRef.current,
        timestamp: new Date().toISOString(),
      });
    };
  }, []); // Runs only on mount/unmount

  return visitors;
}