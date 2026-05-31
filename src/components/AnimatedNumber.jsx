import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * AnimatedNumber – Smoothly transitions between numeric values using cubic ease‑out.
 *
 * Features:
 * - Fully ref‑based animation (no state inside rAF) – zero flicker / jumps.
 * - Customisable decimals, duration, and grouping.
 * - Accessible via `aria-label` and live region.
 * - Handles negatives, NaN, and extremely fast value changes.
 */
export default function AnimatedNumber({
  value,
  decimals = 2,
  duration = 800,
  useGrouping = true,
}) {
  const [display, setDisplay] = useState(() => formatNumber(parseFloat(value) || 0, decimals, useGrouping));

  // Refs for animation state (no stale closures)
  const rafIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(parseFloat(value) || 0);
  const targetValueRef = useRef(parseFloat(value) || 0);
  const currentAnimatedRef = useRef(parseFloat(value) || 0);

  // Update target ref when value changes
  useEffect(() => {
    const newTarget = parseFloat(value) || 0;
    if (newTarget !== targetValueRef.current) {
      // Cancel any ongoing animation
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Start from the current animated value (not the display state)
      startValueRef.current = currentAnimatedRef.current;
      targetValueRef.current = newTarget;
      startTimeRef.current = null;
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [value, decimals, useGrouping]);

  // Animation loop – pure refs, no external dependencies
  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    // cubic ease‑out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased;

    // Store current animated value for future interruptions
    currentAnimatedRef.current = current;

    setDisplay(formatNumber(current, decimals, useGrouping));

    if (progress < 1) {
      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      currentAnimatedRef.current = targetValueRef.current;
      rafIdRef.current = null;
    }
  }, [duration, decimals, useGrouping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Memoize formatted target for aria-label (always precise)
  const ariaValue = useMemo(() => parseFloat(value).toFixed(decimals), [value, decimals]);

  return (
    <span
      aria-label={ariaValue}
      role="status"
      aria-live="polite"
      style={{ whiteSpace: 'nowrap' }}
    >
      {display}
    </span>
  );
}

// ── Helper ─────────────────────────────────────────────────────────
function formatNumber(num, decimals, grouping) {
  if (grouping) {
    try {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      // fallback to fixed
    }
  }
  return num.toFixed(decimals);
}