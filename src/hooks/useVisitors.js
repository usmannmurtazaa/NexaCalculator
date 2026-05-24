import { useState, useEffect, useRef } from 'react';
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
  const intervalRef = useRef(null);

  useEffect(() => {
    // Log initial visitor session
    logEvent('visitor_active', {
      initial_count: visitors,
      timestamp: new Date().toISOString(),
    });

    // Periodic visitor count increase simulation
    intervalRef.current = setInterval(() => {
      setVisitors((prev) => {
        // More realistic organic growth pattern
        if (Math.random() > 0.6) {
          const increment = Math.floor(Math.random() * 2) + 1;
          const newCount = prev + increment;

          // Log significant milestones (every 10 new visitors)
          if (newCount % 10 === 0) {
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
      logEvent('visitor_session_end', {
        final_count: visitors,
        timestamp: new Date().toISOString(),
      });
    };
  }, []); // Run only on mount/unmount

  return visitors;
}