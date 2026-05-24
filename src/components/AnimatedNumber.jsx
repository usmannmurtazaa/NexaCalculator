import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * AnimatedNumber – Smoothly transitions a numeric value from its previous
 * state to the new target value with cubic ease-out animation.
 *
 * Features:
 * - Custom decimals (default 2)
 * - Accessible (screen-reader friendly)
 * - Handles negative numbers & edge cases
 * - Supports formatting with toLocaleString
 * - Efficient rAF cleanup, no memory leaks
 */
export default function AnimatedNumber({
  value,
  decimals = 2,
  duration = 800,
  useGrouping = true,
}) {
  const [display, setDisplay] = useState('0');
  const rafIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);
  const targetRef = useRef(parseFloat(value) || 0);

  // Store latest target in ref to avoid stale closure inside rAF
  const target = parseFloat(value) || 0;
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const animate = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = startValueRef.current + (targetRef.current - startValueRef.current) * eased;
      setDisplay(
        useGrouping
          ? current.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : current.toFixed(decimals)
      );

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    },
    [decimals, duration, useGrouping]
  );

  useEffect(() => {
    // Cancel any ongoing animation
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    startTimeRef.current = null;
    // Start from the currently displayed value (rough approximation)
    // For a seamless transition, we use the previous numeric display as start
    startValueRef.current = parseFloat(display) || 0;
    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [value, decimals, duration, animate, display]);

  return (
    <span
      aria-label={parseFloat(value).toFixed(decimals)}
      role="status"
      style={{ whiteSpace: 'nowrap' }}
    >
      {display}
    </span>
  );
}